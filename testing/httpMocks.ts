import { createMocks as _createMocks } from "node-mocks-http";
import type { RequestOptions, ResponseOptions, Mocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

export const createMocks = _createMocks as (
  reqOptions?: RequestOptions,
  resOptions?: ResponseOptions
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
) => Mocks<NextApiRequest, NextApiResponse>;
