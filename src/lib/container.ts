import {
  Container as InversifyContainer,
  decorate,
  BindingInWhenOnSyntax,
  BindingWhenOnSyntax,
  ContainerOptions,
} from 'inversify-esm';
import { generateIdAndAddToCache } from './id.helper';
import { injectable } from './inject.helper';
import { Constructor, Id } from './inversify.types';

function decorateCatchable(
  decorator: ClassDecorator | ParameterDecorator | MethodDecorator,
  constructor: any,
  parameterIndex?: string | number
): void {
  try {
    decorate(decorator, constructor, parameterIndex);
  } catch (e) {
    if (
      e instanceof Error &&
      e.message !== 'Cannot apply @injectable decorator multiple times.'
    ) {
      throw e;
    }
  }
}

/**
 * This class is the wrapper of inversify Container to add more functionalities.
 * The library exports an instance of the class but you can create your own instance
 */
export class Container extends InversifyContainer {
  public bindTo<T>(
    constructor: Constructor<T>,
    customId?: Id
  ): BindingInWhenOnSyntax<T> {
    const id = generateIdAndAddToCache(constructor, customId);
    decorateCatchable(injectable(), constructor);

    return super.bind<T>(id).to(constructor);
  }

  public addTransient<T>(
    constructor: Constructor<T>,
    customId?: Id
  ): BindingWhenOnSyntax<T> {
    const id = generateIdAndAddToCache(constructor, customId);
    decorateCatchable(injectable(), constructor);

    return super.bind<T>(id).to(constructor).inTransientScope();
  }

  public addSingleton<T>(
    constructor: Constructor<T>,
    customId?: Id
  ): BindingWhenOnSyntax<T> {
    const id = generateIdAndAddToCache(constructor, customId);
    decorateCatchable(injectable(), constructor);

    return super.bind<T>(id).to(constructor).inSingletonScope();
  }

  public addRequest<T>(
    constructor: Constructor<T>,
    customId?: Id
  ): BindingWhenOnSyntax<T> {
    const id = generateIdAndAddToCache(constructor, customId);
    decorateCatchable(injectable(), constructor);

    return super.bind<T>(id).to(constructor).inRequestScope();
  }

  public get<T>(serviceIdentifier: Id): T {
    return super.get<T>(serviceIdentifier);
  }
}

let container: Container;

export function getContainer(): Container {
  return container;
}

export function setContainer(options?: ContainerOptions): Container {
  return (container = new Container(options));
}

export function resetContainer() {
  getContainer().unbindAll();
}
