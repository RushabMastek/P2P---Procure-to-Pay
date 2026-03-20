// Complete External Questionnaire Form Schema
// Based on the Content tab from External form.ods

export const formSchema = {
  sections: [
    {
      id: 'section-1',
      number: '1',
      title: 'Introduction',
      type: 'requirement',
      fields: [
        {
          id: 'intro-notice',
          number: '1',
          type: 'requirement',
          label: 'Important Notice',
          content: 'THE NUMBER SEQUENCE WILL BE CHANGED ACCORDINGLY BASED ON THE SELECTION OF ANSWERS, TO CAPTURE THE COUNTRY SPECIFIC DATA. HENCE YOU WILL BE SEEING MISSING NUMBER SEQUENCE. KINDLY IGNORE AND PROCEED WITH FILLING / REVIEWING THE FORM.',
          required: false
        }
      ]
    },
    {
      id: 'section-2',
      number: '2',
      title: 'NDA Section',
      type: 'section',
      fields: [
        {
          id: 'company-code',
          number: '2.1',
          type: 'select',
          label: 'Company Code (Entity)',
          options: [
            'EVOLUTIONARY SYSTEMS [EVSG]',
            'EVOLUTIONARY SYSTEMS BAHR [EVBH]',
            'EVOLUTIONARY SYSTEMS BV [EVNL]',
            'EVOLUTIONARY SYSTEMS CANA [EVCN]',
            'EVOLUTIONARY SYSTEMS COMP [EVUK]',
            'EVOLUTIONARY SYSTEMS CONS [EVAD]',
            'EVOLUTIONARY SYSTEMS CORP [EVUS]',
            'EVOLUTIONARY SYSTEMS EGYP [EVEG]',
            'EVOLUTIONARY SYSTEMS PRI [ESPL]',
            'EVOLUTIONARY SYSTEMS PTY [EVAU]',
            'EVOLUTIONARY SYSTEMS QATA [EVQR]',
            'EVOLUTIONARY SYSTEMS SAUD [EVSA]',
            'EVOSYS - ROMANIA BR [EVRB]',
            'EVOSYS CONSULTANCY SERVIC [EVMY]',
            'EVOSYS KUWAIT WLLC [EVKW]',
            'MASTEK (UK) Limited [MUK]',
            'MASTEK ARABIA FZ LLC [EVDB]',
            'MASTEK DIGITAL INC. [MCN]',
            'MASTEK INC. [DGLT]',
            'MASTEK LTD [MLTD]',
            'NEWBURY TALEO GROUP, INC [EVNB]',
            'TA INC [TTIN]',
            'TA INFO INDIA PVT [TTIL]',
            'BIZANALYTICA LLC [BAUS]',
            'METASOFT TECH SYS PVT LTD [MSIN]',
            'META SOFT SOLUTIONS LLC [MSUS]'
          ],
          required: true
        },
        {
          id: 'nda-agreement',
          number: '2.2',
          type: 'select',
          label: 'Do you agree to the NDA?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'nda-contact-query',
          number: '2.29',
          type: 'requirement',
          label: 'NDA Contact Information',
          content: 'For any queries related to NDA please contact saparibacommercialteam@mastek.com',
          visibilityCondition: (formData) => formData['nda-agreement'] === 'No',
          required: false
        }
      ]
    },
    {
      id: 'section-3',
      number: '3',
      title: 'Supplier Information',
      type: 'section',
      fields: [
        {
          id: 'ariba-note',
          number: '3.1',
          type: 'textarea',
          label: 'Note',
          defaultValue: '<Mastek Group Entity mentioned in question 2.1> has moved to the Ariba Network for purchasing to help drive compliance, process efficiency and collaboration with our suppliers. As part of this initiative, we are encouraging our suppliers to send and receive transactional documents including POs and Invoices over the Ariba Network. Benefits for your organization include: - Automated invoice to Purchase Order matching reducing delays in invoice processing. - Real-time view of invoice and payment status. - Report against and archive your orders, invoices and other transactions. - Greater wallet and market share through use of online catalogs and potential new business opportunities through visibility to other buying organizations on the Ariba Network. Please refer to the URL below for further details. https://www.ariba.com/ariba-network/ariba-network-for-suppliers',
          required: true,
          readOnly: true
        },
        {
          id: 'country-code',
          number: '3.2',
          type: 'select',
          label: 'Country Code',
          options: [
            'ALBANIA [AL]', 'ALGERIA [DZ]', 'AUSTRALIA [AU]', 'AUSTRIA [AT]', 'BAHRAIN [BH]',
            'BANGLADESH [BD]', 'BELGIUM [BE]', 'BRAZIL [BR]', 'CANADA [CA]', 'CHINA [CN]',
            'DENMARK [DK]', 'EGYPT [EG]', 'FRANCE [FR]', 'GERMANY [DE]', 'INDIA [IN]',
            'IRELAND [IE]', 'ITALY [IT]', 'JAPAN [JP]', 'KUWAIT [KW]', 'MALAYSIA [MY]',
            'MEXICO [MX]', 'NETHERLANDS [NL]', 'NEW ZEALAND [NZ]', 'NORWAY [NO]', 'POLAND [PL]',
            'PORTUGAL [PT]', 'QATAR [QA]', 'ROMANIA [RO]', 'SAUDI ARABIA [SA]', 'SINGAPORE [SG]',
            'SOUTH AFRICA [ZA]', 'SPAIN [ES]', 'SWEDEN [SE]', 'SWITZERLAND [CH]', 'UNITED ARAB EMIRATES [AE]',
            'UNITED KINGDOM [GB]', 'UNITED STATES [US]'
          ],
          required: true
        },
        {
          id: 'supplier-type-domestic',
          number: '3.3',
          type: 'hidden',
          label: 'Supplier Type',
          defaultValue: 'Domestic',
          visibilityCondition: (formData) => formData['country-code']?.includes('[IN]'),
          required: true
        },
        {
          id: 'supplier-type-foreign',
          number: '3.4',
          type: 'hidden',
          label: 'Supplier Type',
          defaultValue: 'Foreign',
          visibilityCondition: (formData) => !formData['country-code']?.includes('[IN]'),
          required: true
        },
        {
          id: 'title-text',
          number: '3.5',
          type: 'select',
          label: 'Title',
          options: ['Ms.', 'Mr.', 'Company', 'Miss'],
          required: false
        },
        {
          id: 'org-name-1',
          number: '3.6',
          type: 'text',
          label: 'Organization Name 1',
          maxLength: 35,
          required: true
        },
        {
          id: 'org-name-2',
          number: '3.7',
          type: 'text',
          label: 'Organization Name 2',
          maxLength: 35,
          required: false
        },
        {
          id: 'promoters-name-india',
          number: '3.8',
          type: 'text',
          label: 'Name of the Promoters',
          visibilityCondition: (formData) => formData['country-code']?.includes('[IN]'),
          required: true
        },
        {
          id: 'promoters-name-uk',
          number: '3.9',
          type: 'text',
          label: 'Name of the Promoters',
          visibilityCondition: (formData) => formData['country-code']?.includes('[GB]'),
          required: true
        },
        {
          id: 'trade-name-uk',
          number: '3.10',
          type: 'text',
          label: 'Trade Name',
          visibilityCondition: (formData) => formData['country-code']?.includes('[GB]'),
          required: true
        },
        {
          id: 'org-type-india',
          number: '3.11',
          type: 'select',
          label: 'Type of Organization',
          options: ['Public Ltd.', 'Pvt. Ltd', 'Partnership', 'Sole Proprietorship'],
          visibilityCondition: (formData) => formData['country-code']?.includes('[IN]'),
          required: true
        },
        {
          id: 'org-type-uk',
          number: '3.12',
          type: 'select',
          label: 'Type of Organization',
          options: ['Public Ltd.', 'Pvt. Ltd', 'Partnership', 'Sole Proprietorship', 'Others'],
          visibilityCondition: (formData) => formData['country-code']?.includes('[GB]'),
          required: true
        },
        {
          id: 'org-type-uk-others',
          number: '3.13',
          type: 'text',
          label: 'Please specify Organization (Others)',
          visibilityCondition: (formData) => formData['org-type-uk'] === 'Others',
          required: true
        },
        {
          id: 'org-type-us',
          number: '3.14',
          type: 'select',
          label: 'Type of Organization',
          options: ['Individual', 'Sole Proprietor', 'C Corporation', 'S Corporation', 'Partnership', 'Trust/estate', 'LLC', 'Others'],
          visibilityCondition: (formData) => formData['country-code']?.includes('[US]'),
          required: true
        },
        {
          id: 'org-type-us-others',
          number: '3.15',
          type: 'text',
          label: 'Please specify Organization (Others)',
          visibilityCondition: (formData) => formData['org-type-us'] === 'Others',
          required: true
        },
        {
          id: 'individual-type',
          number: '3.16',
          type: 'select',
          label: 'If Individual',
          options: ['US Citizen', 'Non US Citizen'],
          visibilityCondition: (formData) => formData['org-type-us'] === 'Individual',
          required: true
        },
        {
          id: 'company-is',
          number: '3.17',
          type: 'select',
          label: 'Company Is',
          options: ['Independent', 'Division of', 'Subsidiary of', 'Affiliate of', 'Joint venture of'],
          visibilityCondition: (formData) => formData['country-code']?.includes('[US]'),
          required: true
        },
        {
          id: 'supply-type',
          number: '3.18',
          type: 'select',
          label: 'Supply Type',
          options: ['Service Only', 'Material Only', 'Both Material & Service'],
          required: true
        },
        {
          id: 'supplier-status-uk',
          number: '3.19',
          type: 'select',
          label: 'Supplier Status',
          options: ['Principle', 'OEM', 'Distributor', 'Reseller', 'Other (Please Specify)'],
          visibilityCondition: (formData) => formData['country-code']?.includes('[GB]'),
          required: true
        },
        {
          id: 'supplier-status-uk-others',
          number: '3.20',
          type: 'text',
          label: 'Please specify supplier status for (supplier status - others)',
          visibilityCondition: (formData) => formData['supplier-status-uk'] === 'Other (Please Specify)',
          required: true
        },
        {
          id: 'supplier-status-india',
          number: '3.21',
          type: 'select',
          label: 'Supplier Status',
          options: ['Principle', 'OEM', 'Distributor', 'Reseller', 'Other (Please Specify)'],
          visibilityCondition: (formData) => formData['country-code']?.includes('[IN]'),
          required: true
        },
        {
          id: 'supplier-status-india-others',
          number: '3.22',
          type: 'text',
          label: 'Please specify supplier status for (supplier status - others)',
          visibilityCondition: (formData) => formData['supplier-status-india'] === 'Other (Please Specify)',
          required: true
        },
        {
          id: 'vendor-type',
          number: '3.23',
          type: 'select',
          label: 'Vendor Type',
          options: ['Consultants', 'Service Provider', 'Contractor', 'Manufacturer', 'Trader', 'Dealer', 'Agents', 'Transporter', 'Job- Workers', 'Job works'],
          required: true
        },
        {
          id: 'state-incorporation',
          number: '3.24',
          type: 'text',
          label: 'State of Incorporation',
          visibilityCondition: (formData) => formData['country-code']?.includes('[US]'),
          required: true
        },
        {
          id: 'incorporation-status',
          number: '3.25',
          type: 'select',
          label: 'Incorporation Status',
          options: ['Publicly Held', 'Privately Held'],
          visibilityCondition: (formData) => formData['country-code']?.includes('[US]'),
          required: true
        },
        {
          id: 'num-employees',
          number: '3.28',
          type: 'number',
          label: 'Number of Permanent Employees',
          required: true
        },
        {
          id: 'year-establishment',
          number: '3.29',
          type: 'text',
          label: 'Year of Organization Establishment',
          placeholder: 'YYYY',
          required: true
        },
        {
          id: 'company-reg-number',
          number: '3.30',
          type: 'text',
          label: 'Company Registration Number',
          required: true
        },
        {
          id: 'company-reg-cert',
          number: '3.31',
          type: 'file',
          label: 'Please attach the Company Registration Certificate',
          required: true
        },
        {
          id: 'markets-geography',
          number: '3.32',
          type: 'textarea',
          label: 'What Markets/Geography do you provide service',
          required: true
        },
        {
          id: 'company-profile',
          number: '3.33',
          type: 'file',
          label: 'Please attach the Company Corporate Profile of the supplier',
          required: true
        },
        {
          id: 'whistleblower-policy',
          number: '3.34',
          type: 'file',
          label: 'Please download, fill and upload the signed copy of the attached the Whistle blower policy document',
          required: true
        }
      ],
      subsections: [
        {
          id: 'section-3-35',
          number: '3.35',
          title: 'Billing Address',
          fields: [
            {
              id: 'supplier-main-address',
              number: '3.35.1',
              type: 'textarea',
              label: 'Supplier Main Address',
              required: true
            },
            {
              id: 'language-key',
              number: '3.35.2',
              type: 'text',
              label: 'Language Key',
              required: false
            },
            {
              id: 'time-zone',
              number: '3.35.3',
              type: 'text',
              label: 'Time Zone',
              required: false
            },
            {
              id: 'extension-number',
              number: '3.35.4',
              type: 'text',
              label: 'Extension number',
              required: false
            },
            {
              id: 'main-telephone',
              number: '3.35.5',
              type: 'tel',
              label: 'Main telephone number/landline number',
              required: true
            },
            {
              id: 'fax-no',
              number: '3.35.6',
              type: 'text',
              label: 'Fax No.',
              required: false
            },
            {
              id: 'website-link',
              number: '3.35.7',
              type: 'url',
              label: 'Internet homepage address/Website Link',
              required: false
            },
            {
              id: 'uri-type',
              number: '3.35.8',
              type: 'text',
              label: 'URI type code',
              required: false
            },
            {
              id: 'transmit-receive-docs',
              number: '3.35.9',
              type: 'select',
              label: 'Are you willing and able to transmit and receive traditional Procurement and Accounts Payables documents?',
              options: ['Yes', 'No'],
              required: true
            }
          ]
        },
        {
          id: 'section-3-36',
          number: '3.36',
          title: 'Transaction Information',
          fields: [
            {
              id: 'primary-contact-po',
              number: '3.36.1',
              type: 'text',
              label: 'Primary contact for PO',
              required: true
            },
            {
              id: 'email-po-1',
              number: '3.36.2',
              type: 'email',
              label: 'E-mail address for purchase orders',
              helperText: 'This email address will be used to send purchase orders',
              required: true
            },
            {
              id: 'email-po-2',
              number: '3.36.3',
              type: 'email',
              label: 'E-mail address for purchase orders (Secondary)',
              helperText: 'This email address will be used to send purchase orders',
              required: false
            },
            {
              id: 'phone-po',
              number: '3.36.4',
              type: 'tel',
              label: 'Telephone Number of Primary contact of PO',
              required: true
            },
            {
              id: 'primary-contact-ar',
              number: '3.36.5',
              type: 'text',
              label: 'Primary Contact for Account Receivable',
              required: true
            },
            {
              id: 'email-ar',
              number: '3.36.6',
              type: 'email',
              label: 'E-mail address for accounts receivable',
              helperText: 'This email address will be used for accounts receivable',
              required: true
            },
            {
              id: 'phone-ar',
              number: '3.36.7',
              type: 'tel',
              label: 'Telephone number for primary contact of Account Receivable',
              required: true
            },
            {
              id: 'po-email-note-lang',
              number: '3.36.8',
              type: 'text',
              label: 'PO e-mail address note language',
              required: false
            },
            {
              id: 'po-email-note',
              number: '3.36.9',
              type: 'textarea',
              label: 'PO e-mail address note',
              helperText: 'This note will be used for PO communication',
              required: false
            },
            {
              id: 'remittance-email-note-lang',
              number: '3.36.10',
              type: 'text',
              label: 'Remittance e-mail address note language',
              required: false
            },
            {
              id: 'remittance-email-note',
              number: '3.36.11',
              type: 'textarea',
              label: 'Remittance e-mail address note',
              helperText: 'This note will be used for remittance communication',
              required: false
            }
          ]
        }
      ]
    },
    {
      id: 'section-4',
      number: '4',
      title: 'Tax Information',
      type: 'section',
      fields: [
        {
          id: 'po-currency',
          number: '4.1',
          type: 'select',
          label: 'Purchase Order Currency',
          options: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'AED', 'SAR', 'QAR'],
          required: true
        },
        {
          id: 'tax-country',
          number: '4.2',
          type: 'select',
          label: 'Tax Country',
          options: ['India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Other'],
          required: true
        },
        {
          id: 'have-pan-india',
          number: '4.3',
          type: 'select',
          label: 'Do you have PAN Number?',
          options: ['Yes', 'No'],
          visibilityCondition: (formData) => formData['country-code']?.includes('[IN]'),
          required: true
        },
        {
          id: 'pan-number',
          number: '4.4',
          type: 'text',
          label: 'PAN Number (Please enter in Uppercase)',
          visibilityCondition: (formData) => formData['have-pan-india'] === 'Yes',
          required: true
        },
        {
          id: 'pan-card',
          number: '4.5',
          type: 'file',
          label: 'Please attach PAN Card',
          visibilityCondition: (formData) => formData['have-pan-india'] === 'Yes',
          required: true
        },
        {
          id: 'have-gst',
          number: '4.17',
          type: 'select',
          label: 'Do you have GST Number?',
          options: ['Yes', 'No'],
          visibilityCondition: (formData) => formData['country-code']?.includes('[IN]'),
          required: true
        },
        {
          id: 'gst-number',
          number: '4.18',
          type: 'text',
          label: 'GST Number (Please enter in Uppercase)',
          visibilityCondition: (formData) => formData['have-gst'] === 'Yes',
          required: true
        },
        {
          id: 'gst-cert',
          number: '4.19',
          type: 'file',
          label: 'Please attach Original GSTN certificate. (Provisional certificate is not allowed)',
          visibilityCondition: (formData) => formData['have-gst'] === 'Yes',
          required: true
        },
        {
          id: 'w9-form',
          number: '4.30',
          type: 'file',
          label: 'Please attach the W9 Form',
          visibilityCondition: (formData) => formData['country-code']?.includes('[US]'),
          required: true
        },
        {
          id: 'have-vat-uk',
          number: '4.6',
          type: 'select',
          label: 'Do you have a VAT number?',
          options: ['Yes', 'No'],
          visibilityCondition: (formData) => formData['country-code']?.includes('[GB]'),
          required: true
        },
        {
          id: 'vat-number-uk',
          number: '4.7',
          type: 'text',
          label: 'Please enter the VAT No',
          visibilityCondition: (formData) => formData['have-vat-uk'] === 'Yes',
          required: true
        },
        {
          id: 'vat-declaration-uk',
          number: '4.8',
          type: 'file',
          label: 'Please attach VAT declaration',
          visibilityCondition: (formData) => formData['have-vat-uk'] === 'Yes',
          required: true
        }
      ]
    },
    {
      id: 'section-5',
      number: '5',
      title: 'Bank Information',
      type: 'section',
      fields: [
        {
          id: 'account-holder-name',
          number: '5.1',
          type: 'text',
          label: 'Account Holder Name',
          required: true
        },
        {
          id: 'bank-name',
          number: '5.2',
          type: 'text',
          label: 'Name of the Bank',
          required: true
        },
        {
          id: 'account-type',
          number: '5.3',
          type: 'select',
          label: 'Type of the Account',
          options: ['Savings', 'Current', 'Checking'],
          required: true
        },
        {
          id: 'account-number',
          number: '5.4',
          type: 'text',
          label: 'Bank Account Number',
          required: true
        },
        {
          id: 'bank-country',
          number: '5.5',
          type: 'select',
          label: 'Bank Country Code',
          options: ['IN', 'US', 'GB', 'AE', 'SA', 'QA', 'Other'],
          required: true
        },
        {
          id: 'ifsc-code',
          number: '5.7',
          type: 'text',
          label: 'Bank Keys (IFSC Code)',
          visibilityCondition: (formData) => formData['bank-country'] === 'IN',
          required: true
        },
        {
          id: 'aba-routing',
          number: '5.8',
          type: 'text',
          label: 'Bank Keys (ABA / Routing Number)',
          visibilityCondition: (formData) => formData['bank-country'] === 'US',
          required: true
        },
        {
          id: 'sort-code',
          number: '5.9',
          type: 'text',
          label: 'Bank Keys (Sort code)',
          visibilityCondition: (formData) => formData['bank-country'] === 'GB',
          required: true
        },
        {
          id: 'bank-address',
          number: '5.12',
          type: 'textarea',
          label: 'Bank Address',
          required: true
        },
        {
          id: 'bank-manager-name',
          number: '5.13',
          type: 'text',
          label: "Bank Branch Manager's Name",
          required: false
        },
        {
          id: 'bank-phone',
          number: '5.14',
          type: 'tel',
          label: 'Bank Branch Telephone No.',
          required: false
        },
        {
          id: 'cancelled-cheque',
          number: '5.15',
          type: 'file',
          label: 'Attach cancelled cheque (Scan copy of cancelled Cheque)',
          required: true
        },
        {
          id: 'bank-mandate',
          number: '5.16',
          type: 'file',
          label: 'Please attach duly sign Bank Mandate Form.(Refer attached documents)',
          required: true
        }
      ]
    },
    {
      id: 'section-6',
      number: '6',
      title: 'Annual Sales Turnover',
      type: 'section',
      fields: [
        {
          id: 'turnover-note',
          type: 'requirement',
          label: 'Turnover Information',
          content: 'Please provide annual sales turnover for the latest 2 financial years',
          required: false
        },
        {
          id: 'turnover-year-1-currency',
          type: 'select',
          label: 'Select Turnover currency (Year 1)',
          options: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'],
          required: true
        },
        {
          id: 'turnover-year-1',
          type: 'text',
          label: 'Enter financial year (Year 1)',
          placeholder: '2023-2024',
          required: true
        },
        {
          id: 'turnover-amount-1',
          type: 'number',
          label: 'Supplier Turnover (Year 1)',
          required: true
        },
        {
          id: 'profit-amount-1',
          type: 'number',
          label: 'Supplier Profit (Year 1)',
          required: false
        },
        {
          id: 'turnover-year-2-currency',
          type: 'select',
          label: 'Select Turnover currency (Year 2)',
          options: ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'],
          required: true
        },
        {
          id: 'turnover-year-2',
          type: 'text',
          label: 'Enter financial year (Year 2)',
          placeholder: '2022-2023',
          required: true
        },
        {
          id: 'turnover-amount-2',
          type: 'number',
          label: 'Supplier Turnover (Year 2)',
          required: true
        },
        {
          id: 'profit-amount-2',
          type: 'number',
          label: 'Supplier Profit (Year 2)',
          required: false
        }
      ]
    },
    {
      id: 'section-11',
      number: '11',
      title: 'Legal Declaration - Environment',
      type: 'section',
      fields: [
        {
          id: 'legal-notice-env',
          type: 'requirement',
          label: 'Environmental Compliance Notice',
          content: 'Hazardous waste and other wastes generated from electric products constitutes a significant environmental issue. Please ensure compliance with all environmental regulations.',
          required: false
        },
        {
          id: 'employment-under-18',
          number: '11.5',
          type: 'select',
          label: 'Employment of person under 18 years of age is strictly prohibited in any establishment',
          options: ['I Agree', 'I Disagree'],
          required: true
        },
        {
          id: 'waste-management',
          number: '11.6',
          type: 'select',
          label: 'Does your organization follows waste management procedures as per government guidelines?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'recycling-procedures',
          number: '11.7',
          type: 'select',
          label: 'Are proper recycling procedures being followed while doing recycling of your organization waste?',
          options: ['Yes', 'No'],
          required: true
        }
      ]
    },
    {
      id: 'section-12',
      number: '12',
      title: 'Legal Declaration - Anti-Corruption',
      type: 'section',
      fields: [
        {
          id: 'legal-notice-corruption',
          number: '12.1',
          type: 'requirement',
          label: 'Anti-Corruption Notice',
          content: 'Note - You must comply with all anti-corruption laws and regulations',
          required: false
        },
        {
          id: 'state-owned',
          number: '12.2',
          type: 'select',
          label: 'Is your Organization a State Owned Enterprise (SOE) or Government Controlled?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'govt-interaction',
          number: '12.3',
          type: 'select',
          label: 'In the course of performing work/services, will you have any government interaction?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'govt-interaction-specify',
          number: '12.4',
          type: 'textarea',
          label: 'In case of Government interaction please specify.',
          visibilityCondition: (formData) => formData['govt-interaction'] === 'Yes',
          required: true
        },
        {
          id: 'lobbying-services',
          number: '12.5',
          type: 'select',
          label: 'Is your company providing lobbying or consulting services?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'compliance-ethics',
          number: '12.9',
          type: 'select',
          label: 'Does your Organization have a compliance and ethics program that includes appropriate training?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'exec-responsibility',
          number: '12.12',
          type: 'select',
          label: 'Does your Organization designate executive-level individual(s) with the responsibility for ethics and compliance?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'anti-bribery-policy',
          number: '12.13',
          type: 'select',
          label: 'Does your organization have policies and procedures prohibiting bribery and/or illegal inducements?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'accountability',
          number: '12.14',
          type: 'select',
          label: 'Are your Employees and third party representatives held accountable for compliance?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'reporting-mechanism',
          number: '12.17',
          type: 'select',
          label: 'Does your organization have a mechanism for employees/business partners to report suspected violations?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'due-diligence',
          number: '12.18',
          type: 'select',
          label: 'Do you perform due diligence procedures of third-party representatives to evaluate corruption risks?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'risk-assessment',
          number: '12.19',
          type: 'select',
          label: 'Does your Organization perform a periodic anti-corruption risk assessment?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'compliance-training',
          number: '12.20',
          type: 'select',
          label: 'Do you require periodic compliance training that includes anti-corruption training?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'cert-no-bribery-govt',
          number: '12.21',
          type: 'select',
          label: 'Do you certify that you will not directly, or indirectly offer, pay, promise, or authorize any payment to government officials?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'cert-no-bribery-commercial',
          number: '12.22',
          type: 'select',
          label: 'Do you certify that you will not directly, or indirectly offer, pay, promise, or authorize any payment to commercial recipients?',
          options: ['Yes', 'No'],
          required: true
        },
        {
          id: 'data-collection-acknowledge',
          number: '12.23',
          type: 'checkbox',
          label: 'The information you provide in this questionnaire is collected for the purpose of vendor assessment',
          required: true
        },
        {
          id: 'self-declaration',
          number: '12.24',
          type: 'file',
          label: 'Please download, fill and upload the attached Self declaration form',
          required: true
        }
      ]
    },
    {
      id: 'section-13',
      number: '13',
      title: 'Information Sharing',
      type: 'section',
      fields: [
        {
          id: 'info-sharing',
          number: '13',
          type: 'select',
          label: 'You may share your information with all companies or you may share your information with specific companies',
          options: ['Share with all companies', 'Share with specific companies only'],
          required: true
        }
      ]
    },
    {
      id: 'section-14',
      number: '14',
      title: 'Final Declaration',
      type: 'section',
      fields: [
        {
          id: 'final-declaration',
          number: '14',
          type: 'checkbox',
          label: 'I/We hereby declare that we are in compliance to all laws and regulations which applies to our jurisdiction and the information provided is true and correct',
          required: true
        }
      ]
    }
  ]
};

// Helper function to get all fields from schema including subsections
export const getAllFields = () => {
  const fields = [];
  formSchema.sections.forEach(section => {
    if (section.fields) {
      fields.push(...section.fields);
    }
    if (section.subsections) {
      section.subsections.forEach(subsection => {
        if (subsection.fields) {
          fields.push(...subsection.fields);
        }
      });
    }
  });
  return fields;
};

// Helper function to check field visibility
export const isFieldVisible = (field, formData) => {
  if (!field.visibilityCondition) return true;
  return field.visibilityCondition(formData);
};

// Helper function to check if field is required
export const isFieldRequired = (field, formData) => {
  if (!isFieldVisible(field, formData)) return false;
  return field.required === true;
};