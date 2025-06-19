import { HttpParams, HttpResponse } from "@angular/common/http";

import { signal } from "@angular/core";
import { PaginationResult } from "../_models/pagination";

  export function setPaginationResponse<T>(response: HttpResponse<T>,
    paginationResultSignal:ReturnType<typeof signal<PaginationResult<T>|null>>
  ) {
      paginationResultSignal.set({
          items:response.body as T,
          pagination:JSON.parse(response.headers.get('Pagination')!)
        })
  }
export function setPaginationHeaders(pageNumber: number, pageSize: number) {
  let params = new HttpParams();
  if (pageNumber && pageSize) {
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
  }
  return params;
}