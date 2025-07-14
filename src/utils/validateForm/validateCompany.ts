export default function validateCompanyForm(form: any) {
    const newErrors: { [key: string]: string } = {};

    if (!form.companyName.trim()) {
      newErrors.companyName = "Company name is required.";
    }

    return newErrors;
}

