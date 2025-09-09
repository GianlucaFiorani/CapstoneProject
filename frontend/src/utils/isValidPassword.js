export function isValidPassword(password) {
  return (
    /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) && password.length >= 8
  );
}
