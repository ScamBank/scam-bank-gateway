import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Controller('gateway')
export class GatewayController {
  private proxies = {
    core: `http://${process}:3000`,
    users: 'http://localhost:3001',
  };

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, serviceName, ...restPath] = req.path.split('/');

    const target = this.proxies[serviceName] as string;
    if (!target) {
      return res.status(404).json({ message: 'Service not found' });
    }

    console.log(`Proxying request to: ${target}/${restPath.join('/')}`);

    const proxy = createProxyMiddleware({
      target: target,
      changeOrigin: true,
      pathRewrite: {
        [`^/${serviceName}`]: '',
      },
    });

    return proxy(req, res, () => {});
  }
}
