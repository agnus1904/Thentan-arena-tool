
export interface IException{
  error: boolean,
  message: string
}

export interface IResponse<T>{
  error: boolean,
  message?: string,
  data?: T
}
