export const getInitials = (fullName: string): string => {
  const nameParts = fullName.split(" ");

  const firstLetterFirstName = nameParts[0].charAt(0).toUpperCase();

  const lastName = nameParts[nameParts.length - 1];
  const firstLetterLastName = lastName.charAt(0).toUpperCase();

  return firstLetterFirstName + firstLetterLastName;
};
