interface User {
    id: string;
    password: string;
}
  
type SuccessCallback = (user?: User) => void;
type FailCallback = (error?: Error) => void;
  
export function tryLogin(
    email: string,
    password: string,
    success: SuccessCallback,
    fail: FailCallback,
    saveToken?: boolean
): void;
  
export function tryRegister(
    email: string,
    password: string,
    success: SuccessCallback,
    fail: FailCallback
): void;
  
export function tryKakaoLogin(code: string): Promise<any>;