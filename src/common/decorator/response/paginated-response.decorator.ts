import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { Page } from '@common/dto';

export const PaginatedResponse = <TModel extends Type<unknown>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(Page, model),
    ApiOkResponse({
      schema: {
        title: `${Page.name}<${model.name}>`,
        type: 'object',
        allOf: [
          { $ref: getSchemaPath(Page) },
          {
            properties: {
              content: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
