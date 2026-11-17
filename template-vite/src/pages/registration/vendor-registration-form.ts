type FieldTypeValue =
  | 'short_answer'
  | 'paragraph'
  | 'email'
  | 'phone'
  | 'url'
  | 'dropdown'
  | 'file_upload'
  | 'single_checkbox'
  | 'number';

const typeMap: Record<FieldTypeValue, { value: FieldTypeValue; label: string }> = {
  short_answer: { value: 'short_answer', label: 'Short Answer' },
  paragraph: { value: 'paragraph', label: 'Paragraph' },
  email: { value: 'email', label: 'Email' },
  phone: { value: 'phone', label: 'Phone' },
  url: { value: 'url', label: 'URL' },
  dropdown: { value: 'dropdown', label: 'Dropdown' },
  file_upload: { value: 'file_upload', label: 'File Upload' },
  single_checkbox: { value: 'single_checkbox', label: 'Single Checkbox' },
  number: { value: 'number', label: 'Number' },
};

const field = (
  index: number,
  id: string,
  type: FieldTypeValue,
  label: string,
  options?: {
    required?: boolean;
    placeholder?: string;
    choices?: Array<{ value: string; label: string }>;
    acceptedFileTypes?: string[];
  },
) => ({
  index,
  id,
  type: typeMap[type],
  label,
  isMandatoryField: options?.required ?? false,
  placeholder: options?.placeholder,
  options: options?.choices,
  acceptedFileTypes: options?.acceptedFileTypes,
});

/**
 * Sample multi-section vendor registration form matching the Anthers Chromatic story
 * `Form Preview In App Layout / Vendor Registration` (Company → Brand → Bank → Contact).
 */
export const vendorRegistrationSampleForm = {
  sections: [
    {
      id: 'company',
      title: 'Company',
      fields: [
        field(0, 'company_name', 'short_answer', 'Company name', {
          required: true,
          placeholder: 'e.g. Tatynerds Solutions',
        }),
        field(1, 'owner_name', 'short_answer', 'Owner name', {
          required: true,
          placeholder: 'e.g. John Doe',
        }),
        field(2, 'company_phone', 'phone', 'Phone', {
          required: true,
          placeholder: 'e.g. 9876543210',
        }),
        field(3, 'company_email', 'email', 'Email', {
          required: true,
          placeholder: 'e.g. john.doe@vision.com',
        }),
        field(4, 'company_website', 'url', 'Website', {
          placeholder: 'e.g. marmeto.com/vision',
        }),
        field(5, 'business_type', 'dropdown', 'Business type', {
          required: true,
          placeholder: 'Select your business type.',
          choices: [
            { value: 'brand', label: 'Brand' },
            { value: 'distributor', label: 'Distributor' },
            { value: 'manufacturer', label: 'Manufacturer' },
            { value: 'retailer', label: 'Retailer' },
          ],
        }),
        field(6, 'company_registration_number', 'short_answer', 'Company registration number', {
          required: true,
          placeholder: 'e.g. 123456789',
        }),
        field(7, 'registration_document', 'file_upload', 'Upload registration document', {
          required: true,
          acceptedFileTypes: ['application/pdf', 'image/png', 'image/jpeg'],
        }),
        field(8, 'company_logo', 'file_upload', 'Upload logo', {
          acceptedFileTypes: ['image/png', 'image/jpeg'],
        }),
        field(9, 'address_line_1', 'short_answer', 'Address line 1', {
          required: true,
          placeholder: 'e.g. 123 King Street',
        }),
        field(10, 'address_line_2', 'short_answer', 'Address line 2', {
          placeholder: 'e.g. Flora Rainbow',
        }),
        field(11, 'city', 'short_answer', 'City', {
          required: true,
          placeholder: 'e.g. Mumbai',
        }),
        field(12, 'zip_code', 'short_answer', 'Zip code', {
          required: true,
          placeholder: 'e.g. 400001',
        }),
        field(13, 'country', 'dropdown', 'Country/region', {
          required: true,
          placeholder: 'Select your country/region',
          choices: [
            { value: 'in', label: 'India' },
            { value: 'us', label: 'United States' },
            { value: 'gb', label: 'United Kingdom' },
          ],
        }),
        field(14, 'state', 'dropdown', 'State/province', {
          required: true,
          placeholder: 'Select your state/province',
          choices: [
            { value: 'mh', label: 'Maharashtra' },
            { value: 'ka', label: 'Karnataka' },
            { value: 'dl', label: 'Delhi' },
          ],
        }),
        field(15, 'longitude', 'number', 'Longitude', { placeholder: 'e.g. 72.8958' }),
        field(16, 'latitude', 'number', 'Latitude', { placeholder: 'e.g. 19.0759' }),
      ],
    },
    {
      id: 'brand',
      title: 'Brand',
      fields: [
        field(0, 'brand_name', 'short_answer', 'Brand name', {
          required: true,
          placeholder: 'Enter your brand name',
        }),
        field(1, 'brand_logo', 'file_upload', 'Upload logo', {
          acceptedFileTypes: ['image/png', 'image/jpeg'],
        }),
        field(2, 'brand_description', 'paragraph', 'Brand description', {
          placeholder: 'e.g. See what truly drives your revenue',
        }),
        field(3, 'brand_website', 'url', 'Website', {
          placeholder: 'e.g. vision.marmeto.com',
        }),
        field(4, 'brand_category', 'dropdown', 'Brand category', {
          required: true,
          choices: [
            { value: 'fashion', label: 'Fashion' },
            { value: 'beauty', label: 'Beauty' },
            { value: 'home', label: 'Home' },
            { value: 'electronics', label: 'Electronics' },
          ],
        }),
        field(5, 'support_email', 'email', 'Support email', {
          required: true,
          placeholder: 'e.g. help@marmeto.com',
        }),
        field(6, 'trademark_number', 'short_answer', 'Trademark number', {
          placeholder: 'e.g. TM123456',
        }),
        field(7, 'trademark_certificate', 'file_upload', 'Trademark image or certificate', {
          acceptedFileTypes: ['application/pdf', 'image/png', 'image/jpeg'],
        }),
        field(8, 'owner_certificate', 'file_upload', 'Upload owner certificate', {
          acceptedFileTypes: ['application/pdf', 'image/png', 'image/jpeg'],
        }),
      ],
    },
    {
      id: 'bank',
      title: 'Bank',
      fields: [
        field(0, 'account_holder_name', 'short_answer', 'Account holder name', {
          required: true,
          placeholder: 'e.g. John Doe',
        }),
        field(1, 'account_number', 'short_answer', 'Account number', {
          required: true,
          placeholder: 'e.g. 123456789012',
        }),
        field(2, 'account_number_confirm', 'short_answer', 'Re-enter account number', {
          required: true,
          placeholder: 'e.g. 123456789012',
        }),
        field(3, 'bank_name', 'short_answer', 'Bank', {
          required: true,
          placeholder: 'e.g. HDFC Bank',
        }),
        field(4, 'branch', 'short_answer', 'Branch', {
          required: true,
          placeholder: 'e.g. Andheri West',
        }),
        field(5, 'ifsc_code', 'short_answer', 'IFSC code', {
          required: true,
          placeholder: 'e.g. HDFC0001234',
        }),
        field(6, 'account_type', 'dropdown', 'Account type', {
          required: true,
          choices: [
            { value: 'savings', label: 'Savings' },
            { value: 'current', label: 'Current' },
          ],
        }),
        field(7, 'bank_branch_code', 'short_answer', 'Bank branch code', {
          placeholder: 'e.g. 001234',
        }),
        field(8, 'bank_branch_address', 'paragraph', 'Bank branch address', {
          placeholder: 'e.g. 12 Marine Drive, Mumbai',
        }),
        field(9, 'cancelled_cheque', 'file_upload', 'Upload cancelled cheque', {
          required: true,
          acceptedFileTypes: ['application/pdf', 'image/png', 'image/jpeg'],
        }),
        field(10, 'gstin', 'short_answer', 'GSTIN number', {
          placeholder: 'e.g. 27AAAAA0000A1Z5',
        }),
        field(11, 'no_gst', 'single_checkbox', "I don't have GST number"),
        field(12, 'pan', 'short_answer', 'PAN', {
          required: true,
          placeholder: 'e.g. ABCDE1234F',
        }),
        field(13, 'pan_upload', 'file_upload', 'Upload PAN', {
          required: true,
          acceptedFileTypes: ['application/pdf', 'image/png', 'image/jpeg'],
        }),
        field(14, 'aadhar_number', 'short_answer', 'Aadhar number', {
          placeholder: 'e.g. 1234 5678 9012',
        }),
        field(15, 'aadhar_upload', 'file_upload', 'Upload Aadhar', {
          acceptedFileTypes: ['application/pdf', 'image/png', 'image/jpeg'],
        }),
      ],
    },
    {
      id: 'contact',
      title: 'Contact',
      fields: [
        field(0, 'primary_contact_name', 'short_answer', 'Primary contact name', {
          required: true,
          placeholder: 'e.g. Jane Doe',
        }),
        field(1, 'primary_contact_phone', 'phone', 'Phone', {
          required: true,
          placeholder: 'e.g. 9876543210',
        }),
        field(2, 'primary_contact_designation', 'short_answer', 'Designation', {
          placeholder: 'e.g. Operations manager',
        }),
        field(3, 'primary_contact_email', 'email', 'Email address', {
          required: true,
          placeholder: 'e.g. janedoe@vision.com',
        }),
        field(4, 'primary_contact_notes', 'paragraph', 'Notes', {
          placeholder: 'e.g. Handles escalations and product queries.',
        }),
        field(5, 'secondary_contact_name', 'short_answer', 'Contact name', {
          placeholder: 'e.g. Janice Doe',
        }),
        field(6, 'secondary_contact_phone', 'phone', 'Phone number', {
          placeholder: 'e.g. 9876543210',
        }),
        field(7, 'secondary_contact_designation', 'short_answer', 'Designation', {
          placeholder: 'e.g. Partner relations',
        }),
        field(8, 'secondary_contact_email', 'email', 'Email address', {
          placeholder: 'e.g. janice.doe@vision.com',
        }),
        field(9, 'secondary_contact_notes', 'paragraph', 'Notes', {
          placeholder: 'e.g. Handles new partner opportunities and payments.',
        }),
      ],
    },
  ],
};
