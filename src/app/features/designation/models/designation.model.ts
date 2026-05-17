export interface Designation {
  id: number;
  designationName: string;
}

export interface DesignationRequestModel {
  id?: number;
  designationName: string;
  userId:number
}

export interface DesignationApiResponse {
  isSuccess: boolean;
  statusCode: number;
  data: Designation[];
  message?: string;
  errors?: string[] | null;
}
