import { HttpInterceptorFn } from '@angular/common/http';
import { TOKEN } from '../core/services/authentication/authentication.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = sessionStorage.getItem(TOKEN);
  if (token) {
    console.log('from interceptor', token);
    req = req.clone({
      setHeaders: { Authorization: `Basic ${token}` }
    });
  }

  return next(req);
};
