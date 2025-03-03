import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';

@Controller()
export class GatewayController {
  private proxies = {
    core: `http://localhost:3000`,
    users: 'http://localhost:3001',
  };

  private proxyMiddlewares: Record<string, RequestHandler>;

  constructor() {
    this.proxyMiddlewares = {};
    Object.entries(this.proxies).forEach(([service, target]) => {
      this.proxyMiddlewares[service] = createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: {
          [`^/gateway/`]: '',
        },
      });
    });
  }

  @All('gateway/:service/*')
  proxy(@Req() req: Request, @Res() res: Response) {
    const parts = req.path.split('/').filter(Boolean);
    const serviceName = parts[1];

    const proxyMiddleware = this.proxyMiddlewares[serviceName];
    if (!proxyMiddleware) {
      return res.status(404).json({ message: 'Service not found' });
    }

    console.log(
      `Proxying request to service: ${serviceName}, path: ${req.path}`,
    );
    return proxyMiddleware(req, res, () => {});
  }
}
