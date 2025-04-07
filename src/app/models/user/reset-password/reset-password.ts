export class ResetPassword {
  constructor(
    public email: string,
    public code: string,
    public new_password: string
  ) {}
}
