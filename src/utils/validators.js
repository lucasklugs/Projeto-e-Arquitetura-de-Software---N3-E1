export function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

export function parsePositiveNumber(value, fieldName) {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${fieldName} deve ser um numero maior que zero.`);
  }

  return number;
}

export function parseNonNegativeInteger(value, fieldName) {
  const number = Number(value);

  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${fieldName} deve ser um inteiro maior ou igual a zero.`);
  }

  return number;
}

export function requireText(value, fieldName) {
  if (isBlank(value)) {
    throw new Error(`${fieldName} e obrigatorio.`);
  }

  return String(value).trim();
}

export function requireChoice(value, allowedValues, fieldName) {
  const normalized = String(value).trim().toLowerCase();

  if (!allowedValues.includes(normalized)) {
    throw new Error(`${fieldName} deve ser um dos valores: ${allowedValues.join(", ")}.`);
  }

  return normalized;
}

export function validateEmail(value) {
  const email = requireText(value, "email");
  const hasAt = email.includes("@");
  const hasDot = email.split("@")[1]?.includes(".");

  if (!hasAt || !hasDot) {
    throw new Error("email deve possuir formato valido.");
  }

  return email.toLowerCase();
}
