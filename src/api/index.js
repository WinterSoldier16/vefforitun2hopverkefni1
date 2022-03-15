import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import multer from 'multer';

import { requireAuthentication } from '../app.js';

