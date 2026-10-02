export type LoginIn = {
  email: string;
  password: string;
};

export type LoginOut = {
  access_token: string;
  display_name: string;
  staff_code: string | null;
};

export type AdminUser = {
  display_name: string;
  staff_code: string | null;
  email?: string;
};
