const axios = require('axios')
const db = require('../config/db')   // ✅ your pool
const sql = require('mssql')


// =======================
// 🔹 VERIFY TOKEN FLOW
// =======================
exports.verifyToken = async (req, res) => {

    try {

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
                    auth: {
                        username: process.env.SN_USERNAME,
                        password: process.env.SN_PASSWORD
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

        // ✅ Step 5: Decide flow
        if (result.recordset.length > 0) {
            return res.json({
                status: "login",
                email: email
            })
        }

        return res.json({
            status: "register",
            email: email
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
                auth: {
                    username: process.env.SN_USERNAME,
                    password: process.env.SN_PASSWORD
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
                auth: {
                    username: process.env.SN_USERNAME,
                    password: process.env.SN_PASSWORD
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


