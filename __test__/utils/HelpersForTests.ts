import request from 'supertest';
import { app } from '../../src';
import {
  APIErrorResultType,
  CreateVideoInputModel,
  UpdateVideoInputModel,
  VideoType,
} from '../../src/repositories/repository';
import { HTTP_Status } from '../../src/enums';
import { testing_all_dataRoute, videosRoute } from '../../src/routes/routes';

class HelpersForTests {
  constructor() {}

  async deleteAllData() {
    await request(app).delete(testing_all_dataRoute).expect(HTTP_Status.NO_CONTENT_204);
  }

  async getVideos(): Promise<VideoType[]> {
    const result = await request(app).get(videosRoute).expect(HTTP_Status.OK_200);

    return result.body;
  }

  async getVideosById(id: number, httpStatus: number = HTTP_Status.OK_200): Promise<VideoType> {
    const result = await request(app).get(`${videosRoute}/${id}`).expect(httpStatus);

    return result.body;
  }

  async createVideo(
    dto: CreateVideoInputModel,
    httpStatus: number = HTTP_Status.CREATED_201,
    field?: string | string[],
  ): Promise<VideoType | null> {
    const result = await request(app).post(videosRoute).send(dto).expect(httpStatus);

    if (httpStatus !== HTTP_Status.CREATED_201 && field) {
      const error: APIErrorResultType = result.body;
      this.checkError(error, field);
      return null;
    }
    return result.body;
  }

  async updateVideo(
    id: number,
    dto: UpdateVideoInputModel,
    httpStatus: number = HTTP_Status.NO_CONTENT_204,
    field?: string | string[],
  ): Promise<VideoType | null> {
    const result = await request(app).put(`${videosRoute}/${id}`).send(dto).expect(httpStatus);

    if (httpStatus === HTTP_Status.BAD_REQUEST_400 && field) {
      const error: APIErrorResultType = result.body;
      this.checkError(error, field);
      return null;
    }
    return result.body;
  }

  async deleteVideo(id: number, httpStatus: number = HTTP_Status.NO_CONTENT_204): Promise<void> {
    await request(app).delete(`${videosRoute}/${id}`).expect(httpStatus);
  }

  checkError(result: APIErrorResultType, field: string | string[]) {
    if (Array.isArray(field)) {
      if (result.errorsMessages.length !== field.length) throw new Error('bad check Error!');
      for (const resultElement of result.errorsMessages) {
        if (!field.includes(resultElement.field)) throw new Error('bad check Error!');
      }
      return;
    }
    expect(result).toEqual({
      errorsMessages: [
        {
          message: expect.any(String),
          field,
        },
      ],
    });
  }
}

export default new HelpersForTests();
