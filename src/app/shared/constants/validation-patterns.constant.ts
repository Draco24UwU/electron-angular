export const VALID_POSTAL_CODE: RegExp = /^\d{5}$/;

export const VALID_PHONE: RegExp = /^\d{10}$/;

export const ONLY_NUMBERS: RegExp = /^[0-9]*$/;

export const ONLY_LETTERS: RegExp = /^[a-zA-Z\s]*$/;

export const ONLY_LETTERS_UTF8: RegExp = /^[\p{L}\s]*$/u;

export const ONLY_LETTERS_LOWERCASE_UTF8: RegExp = /^[\p{Ll}\s]*$/u;

export const ONLY_LETTERS_UPPERCASE_UTF8: RegExp = /^[\p{Lu}\s]*$/u;

export const ONLY_DIACRITICAL_MARK_UTF8: RegExp = /^[\p{M}\s]*$/u;

export const ONLY_NUMBERS_UTF8: RegExp = /^[\p{N}\s]*$/u;

export const VALID_RFC: RegExp = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;

export const VALID_CURP: RegExp =
  /^[A-Z]{4}[0-9]{6}[HM]{1}[A-Z]{5}[0-9A-Z]{1}[0-9]{1}$/;

export const VALID_PASSWORD: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[&_.:,;@#\-$|¬°!"%\/='?¿¡+*~{}\[\]\(\)^])[a-zA-Z\d&_.:,;@#\-$|¬°!"%\/='?¿¡+*~{}\[\]\(\)^]{8,}$/;

export const YOUTUBE_URL: RegExp =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export const MOBILE_DEVICE: RegExp =
  /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export const VALID_EMAIL: RegExp =
  /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;

export const VALID_CLABE: RegExp = /^\d{18}$/;

export const BANK_ACCOUNT: RegExp = /^\d{10,12}$/;

export const CARD_NUMBER: RegExp = /^\d{16}$/;

export const EXCLUDE_NOT_LETTERS: RegExp = /[^a-zA-Z]/g;

export const EXCLUDE_LETTERS: RegExp = /[a-zA-Z]/g;

export const ISO_DATE: RegExp =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

export const SERVER_DATE: RegExp =
  /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d{2}$/;
