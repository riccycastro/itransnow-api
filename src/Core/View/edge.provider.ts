import { Injectable, Scope } from '@nestjs/common';
import edge from 'edge.js';
import { EdgeRendererContract } from 'edge.js/build/src/Contracts';

@Injectable({ scope: Scope.REQUEST })
export class EdgeProvider {
  private readonly edgeRenderer: EdgeRendererContract;
  public static INSTANCE: EdgeProvider;

  constructor() {
    this.edgeRenderer = edge.getRenderer();
    EdgeProvider.INSTANCE = this;
  }

  async render(templatePath: string, state?: any): Promise<string> {
    return this.edgeRenderer.render(templatePath, state);
  }

  share(locals: any): this {
    this.edgeRenderer.share(locals);
    return this;
  }
}
