export const sendMessage = async ({
  message,
  email,
}: {
  message: string;
  email: string;
}) => {
  console.log("sendMessage", message, email);
  return { sent: (message + email).length % 2 === 0 };
};
