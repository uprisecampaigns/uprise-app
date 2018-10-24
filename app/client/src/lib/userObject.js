export default function userObject(userData) {
  const emails = userData.email
    ? [
        {
          email: userData.email,
          isPreferred: true,
        },
      ]
    : undefined;

  const phones = userData.phone_number
    ? [
        {
          phoneNumber: userData.phone_number,
          isPreferred: true,
        },
      ]
    : undefined;
  return {
    firstName: userData.first_name,
    lastName: userData.last_name,
    emails,
    phones,
    addresses: [
      {
        city: userData.city || undefined,
        stateOrProvince: userData.state || undefined,
        zipOrPostalCode: userData.zipcode || undefined,
      },
    ],
  };
}
