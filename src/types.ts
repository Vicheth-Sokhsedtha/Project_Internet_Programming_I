// types.ts

export interface LoginData {
  username: string
  email: string
  password: string
}

export interface SignUpData extends LoginData {
  phoneNumber: string
}
