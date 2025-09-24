// src/lib/validation.js

export function validateAdminLogin(username, password) {
  const errors = [];

  // Kullanıcı adı sadece harf
  if (!/^[a-zA-Z]+$/.test(username)) {
    errors.push("Kullanıcı adı sadece harflerden oluşmalıdır");
  }

  // Kullanıcı adı uzunluğu
  if (username.length > 10) {
    errors.push("Kullanıcı adı 10 karakterden fazla olamaz");
  }

  // Şifre uzunluğu
  if (password.length > 10) {
    errors.push("Şifre 10 karakterden fazla olamaz");
  }
  if (password.length <= 3) {
    errors.push("Şifre 3 karakterden az olamaz");
  }

  return errors;
}
