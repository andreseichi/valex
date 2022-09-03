type typeEnum =
  | "invalid_api_key"
  | "invalid_employee_id"
  | "card_already_exists"
  | "invalid_card"
  | "card_expired"
  | "card_already_activated"
  | "invalid_cvc"
  | "invalid_password"
  | "password_not_match"
  | "card_already_blocked"
  | "card_already_unblocked"
  | "card_not_activated"
  | "card_blocked";

export interface errors {
  type: typeEnum;
  message: string;
}
