import { Param, ParseUUIDPipe } from '@nestjs/common';

export const UuidParam = (paramName: string): ParameterDecorator => Param(paramName, ParseUUIDPipe);
