const axios = require('axios')
const jwt = require('jsonwebtoken')
const db = require('../config/db')   // ✅ your pool
const sql = require('mssql')
const { sendOTPEmail } = require('../utils/emailService');



// =======================
// 🔹 VERIFY TOKEN FLOW
// =======================
exports.verifyToken = async (req, res) => {

    try {

        const { getAccessToken } = require('../utils/snAuth')

        const accessToken = await getAccessToken()

        const token = req.query.token

        console.log("SN USER:", process.env.SN_USERNAME);
        console.log("SN PASS:", process.env.SN_PASSWORD);

        // ✅ Step 1: Validate token input
        if (!token) {
            return res.status(400).json({
                status: "error",
                message: "Token is required"
            })
        }

        // ✅ Step 2: Call ServiceNow API
        let snResponse

        try {
            snResponse = await axios.get(
                `${process.env.SN_INSTANCE}/api/x_mast4_procure_2/vendorapi/verifyToken`,
                {
                    params: { token },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )
        } catch (error) {

            console.error("ServiceNow Error:", error.response?.data || error.message)

            return res.status(401).json({
                status: "unauthorized",
                message: "Invalid or expired token"
            })
        }

        const email = snResponse.data?.result?.email;

        console.log("Email:- ", JSON.stringify(snResponse.data));

        // ✅ Step 3: Validate email
        if (!email) {
            return res.status(400).json({
                status: "error",
                message: "Email not received from ServiceNow"
            })
        }

        // ✅ Step 4: Check in MSSQL
        const result = await db.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM vendors WHERE email = @email')

        // ✅ Step 5: Generate OTP for additional security
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP with 10-minute expiry
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    try {
        // Delete any existing OTPs for this email first
        await db.request()
            .input('email', sql.VarChar, email)
            .query('DELETE FROM otp_verification WHERE email = @email')

        // Insert new OTP
        await db.request()
            .input('email', sql.VarChar, email)
            .input('otp', sql.VarChar, otp)
            .input('expiry', sql.DateTime, expiryTime)
            .query(`
                INSERT INTO otp_verification (email, otp, expiry, created_at, attempts)
                VALUES (@email, @otp, @expiry, GETDATE(), 0)
            `)

            // TODO: Send OTP via email service
            // Example: await sendOTPEmail(email, otp)
            await sendOTPEmail(email, otp);
            // For testing only - REMOVE in production
            console.log(`🔐 OTP for ${email}: ${otp}`)

        } catch (otpError) {
            console.error("OTP Generation Error:", otpError)
            return res.status(500).json({
                status: "error",
                message: "Failed to generate OTP"
            })
        }

        // ✅ Step 6: Decide flow and require OTP
        if (result.recordset.length > 0) {
            return res.json({
                status: "login",
                email: email,
                requireOTP: true,
                message: "OTP has been sent to your email"
            })
        }

        return res.json({
            status: "register",
            email: email,
            requireOTP: true,
            message: "OTP has been sent to your email"
        })

    }
    catch (err) {

        console.error("Server Error:", err)

        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        })
    }
}



// =======================
// 🔹 REGISTER VENDOR
// =======================
const bcrypt = require('bcryptjs')

exports.registerVendor = async (req, res) => {

    try {

        const { getAccessToken } = require('../utils/snAuth')

        const accessToken = await getAccessToken()

        const {
            dunsNumber,
            userName,
            useEmailAsUsername,
            disclaimerAgreed,
            declarationAgreed,
            companyName,
            street,
            houseNumber, 
            street2,
            street3,
            postalCode,
            city,
            country,
            firstName,
            lastName,
            email,
            password,
            sys_id
        } = req.body

        console.log("Request Body:- ", JSON.stringify(req.body));

        if (!req.body.username || !req.body.email || !req.body.password) {
            return res.status(400).json({
                message: "Username, Email and password required"
            })
        }

        // ✅ Check if already exists
        const existing = await db.request()
            .input('email', sql.VarChar, req.body.email)
            .query('SELECT * FROM vendors WHERE email = @email')

        if (existing.recordset.length > 0) {
            return res.status(400).json({
                message: "Vendor already exists"
            })
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        // ============================
        // 🔹 1. SAVE IN MSSQL
        // ============================
        await db.request()
            .input('Name', sql.VarChar, req.body.username)
            .input('email', sql.VarChar, req.body.email)
            .input('Password', sql.VarChar, hashedPassword)
            .query(`
                INSERT INTO vendors (Name, email, Password)
                VALUES (@Name, @email, @Password)
            `)

        // ============================
        // 🔹 2. UPDATE SERVICENOW
        // ============================
        await axios.patch(
            `${process.env.SN_INSTANCE}/api/now/table/x_mast4_procure_2_vendor_onboarding/${sys_id}`,
            {
                duns_number: dunsNumber,
                company_legal_name: companyName,
                street: street,
                house_number: houseNumber,
                street_2: street2,
                street_3: street3,
                postal_code: postalCode,
                city: city,
                country_region: country,
                contact_first_name: firstName,
                contact_last_name: lastName,
                vendor_stage: "Non - IT Commodity Code Approval" ,
                primary_email: email,
                username: userName,
                use_email_as_username: useEmailAsUsername,
                declaration: disclaimerAgreed,
                declaration: declarationAgreed,
            },
            {
                headers: {
                        Authorization: `Bearer ${accessToken}`
                }
            }
        )

        return res.json({
            message: "Vendor registered successfully"
        })

    }
    catch (err) {

        console.error("Register Error:", err.response?.data || err.message)

        res.status(500).json({
            message: "Server error"
        })
    }
}


// =======================
// 🔹 LOGIN VENDOR
// =======================
exports.loginVendor = async (req, res) => {

    try {

        const { email, password } = req.body
        console.log("Request Body:- ", JSON.stringify(req.body));

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            })
        }

        

        // ✅ Get user
        const result = await db.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM vendors WHERE email = @email')

        

        if (result.recordset.length === 0) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const user = result.recordset[0]

        

        // ✅ Compare password
        const isMatch = await bcrypt.compare(password, user.Password)

        console.log("Entered Password:", password);
        console.log("DB Password:", user.Password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

       const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.json({
            message: "Login successful",
            token,
            user: {
                email: user.email
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getVendorDetails = async (req, res) => {
    try {

        const { getAccessToken } = require('../utils/snAuth')

        const accessToken = await getAccessToken()

        const { email } = req.query

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            })
        }

        // 🔹 Call ServiceNow Table API
        const response = await axios.get(
            `${process.env.SN_INSTANCE}/api/now/table/x_mast4_procure_2_vendor_onboarding`,
            {
                headers: {
                        Authorization: `Bearer ${accessToken}`
                },
                params: {
                    sysparm_query: `contact_primary_email=${email}`,
                    sysparm_limit: 1
                }
            }
        )

        if (!response.data.result || response.data.result.length === 0) {
            return res.status(404).json({
                message: "Vendor request not found"
            })
        }

        const vendor = response.data.result[0]

        // 🔥 Map SN fields → frontend fields
        return res.json({
            sys_id: vendor.sys_id,
            companyName: vendor.vendor_organization_name1,
            street: vendor.street,
            houseNumber: vendor.house_number,
            street2: vendor.street_2,
            street3: vendor.street_3,
            postalCode: vendor.postal_code,
            city: vendor.city,
            country: vendor.country_region,
            firstName: vendor.contact_first_name,
            lastName: vendor.contact_last_name,
            email: vendor.contact_primary_email
        })

    } catch (err) {
        console.error("Fetch Vendor Error:", err.response?.data || err.message)

        res.status(500).json({
            message: "Error fetching vendor details"
        })
    }
};


// =======================
// 🔹 VERIFY OTP
// =======================
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        console.log("OTP Verification Request:", { email, otp })

        // ✅ Validate input
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            })
        }

        // ✅ Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: "OTP must be 6 digits"
            })
        }

        // ✅ Get OTP from database
        const result = await db.request()
            .input('email', sql.VarChar, email)
            .query(`
                SELECT * FROM otp_verification 
                WHERE email = @email 
                ORDER BY created_at DESC
            `)

        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: "No OTP found for this email. Please request a new one."
            })
        }

        const otpRecord = result.recordset[0]

        // ✅ Check if OTP has expired
        if (new Date() > new Date(otpRecord.expiry)) {
            // Delete expired OTP
            await db.request()
                .input('email', sql.VarChar, email)
                .query('DELETE FROM otp_verification WHERE email = @email')

            return res.status(401).json({
                success: false,
                message: "OTP has expired. Please request a new verification link."
            })
        }

        // ✅ Check maximum attempts (prevent brute force)
        if (otpRecord.attempts >= 5) {
            await db.request()
                .input('email', sql.VarChar, email)
                .query('DELETE FROM otp_verification WHERE email = @email')

            return res.status(401).json({
                success: false,
                message: "Too many failed attempts. Please request a new verification link."
            })
        }

        // ✅ Verify OTP
        if (otpRecord.otp !== otp) {
            // Increment failed attempts
            await db.request()
                .input('email', sql.VarChar, email)
                .query(`
                    UPDATE otp_verification 
                    SET attempts = attempts + 1 
                    WHERE email = @email
                `)

            const remainingAttempts = 5 - (otpRecord.attempts + 1)
            return res.status(401).json({
                success: false,
                message: `Invalid OTP. ${remainingAttempts} attempts remaining.`
            })
        }

        // ✅ OTP is valid - Delete it (single use)
        await db.request()
            .input('email', sql.VarChar, email)
            .query('DELETE FROM otp_verification WHERE email = @email')

        // ✅ Check if vendor exists for routing
        const vendorCheck = await db.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM vendors WHERE email = @email')

        const isExisting = vendorCheck.recordset.length > 0

        return res.json({
            success: true,
            message: "OTP verified successfully",
            status: isExisting ? "login" : "register",
            email: email
        })

    } catch (err) {
        console.error("OTP Verification Error:", err)
        res.status(500).json({
            success: false,
            message: "Server error during OTP verification"
        })
    }
}

// =======================
// 🔹 RESEND OTP
// =======================
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000)

        // Delete old OTP
        await db.request()
            .input('email', sql.VarChar, email)
            .query('DELETE FROM otp_verification WHERE email = @email')

        // Insert new OTP
        await db.request()
            .input('email', sql.VarChar, email)
            .input('otp', sql.VarChar, otp)
            .input('expiry', sql.DateTime, expiryTime)
            .query(`
                INSERT INTO otp_verification (email, otp, expiry, created_at, attempts)
                VALUES (@email, @otp, @expiry, GETDATE(), 0)
            `)

        // TODO: Send OTP via email
        console.log(`🔐 Resent OTP for ${email}: ${otp}`)

        return res.json({
            success: true,
            message: "New OTP has been sent to your email"
        })

    } catch (err) {
        console.error("Resend OTP Error:", err)
        res.status(500).json({
            success: false,
            message: "Failed to resend OTP"
        })
    }
}


// =======================
// 🔹 GET PENDING TASKS
// =======================
exports.getPendingTasks = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // TODO: Replace with actual database query
        // This is mock data for now
        const mockTasks = [
            {
                title: "Complete Vendor Profile",
                description: "Please complete all required fields in your vendor profile",
                priority: "high",
                dueDate: "2024-03-25",
                status: "In Progress"
            },
            {
                title: "Submit Tax Documents",
                description: "Submit W-9 form and tax certification documents",
                priority: "high",
                dueDate: "2024-03-28",
                status: "Pending"
            },
            {
                title: "Review Service Agreement",
                description: "Review and sign the master service agreement",
                priority: "medium",
                dueDate: "2024-04-01",
                status: "Pending"
            }
        ];

        // Actual database query (uncomment when ready):
        // const tasks = await db.request()
        //     .input('email', sql.VarChar, email)
        //     .query(`
        //         SELECT title, description, priority, due_date as dueDate, status 
        //         FROM vendor_tasks 
        //         WHERE vendor_email = @email AND status != 'Completed'
        //         ORDER BY priority DESC, due_date ASC
        //     `);

        res.json({
            success: true,
            tasks: mockTasks // Replace with: tasks.recordset
        });

    } catch (err) {
        console.error("Get Pending Tasks Error:", err);
        res.status(500).json({
            message: "Error fetching pending tasks"
        });
    }
};

// =======================
// 🔹 GET CATALOG ITEMS
// =======================
exports.getCatalogItems = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // TODO: Replace with actual database query
        // This is mock data for now
        const mockCatalogItems = [
            {
                name: "Office Supplies",
                description: "Standard office supplies package including pens, paper, and folders",
                price: "299.99",
                status: "active"
            },
            {
                name: "IT Equipment",
                description: "Computers, monitors, and accessories for office setup",
                price: "1,499.99",
                status: "active"
            },
            {
                name: "Furniture Package",
                description: "Desk, chair, and storage solutions",
                price: "899.99",
                status: "pending"
            },
            {
                name: "Software Licenses",
                description: "Annual licenses for productivity software suite",
                price: "499.99",
                status: "active"
            }
        ];

        // Actual database query (uncomment when ready):
        // const items = await db.request()
        //     .input('email', sql.VarChar, email)
        //     .query(`
        //         SELECT name, description, price, status 
        //         FROM catalog_items 
        //         WHERE vendor_email = @email OR is_public = 1
        //         ORDER BY created_at DESC
        //     `);

        res.json({
            success: true,
            items: mockCatalogItems // Replace with: items.recordset
        });

    } catch (err) {
        console.error("Get Catalog Items Error:", err);
        res.status(500).json({
            message: "Error fetching catalog items"
        });
    }
};
