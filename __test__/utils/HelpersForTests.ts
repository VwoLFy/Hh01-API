import request from 'supertest';
import { app } from '../../src';
import { APIErrorResultType, CreateVideoInputModel, VideoType } from '../../src/repositories/repository';
import { HTTP_Status } from '../../src/enums';
import { testing_all_dataRoute, videosRoute } from '../../src/routes/routes';

class HelpersForTests {
  constructor() {}

  async deleteAllData() {
    await request(app).delete(testing_all_dataRoute).expect(204);
  }

  async getVideos(): Promise<VideoType[]> {
    const result = await request(app).get(videosRoute).expect(HTTP_Status.OK_200);

    return result.body;
  }

  async createVideo(
    data: CreateVideoInputModel,
    httpStatus: number = HTTP_Status.CREATED_201,
    field?: string,
  ): Promise<VideoType | null> {
    const result = await request(app).post(videosRoute).send(data).expect(httpStatus);

    if (httpStatus !== HTTP_Status.CREATED_201 && field) {
      const error: APIErrorResultType = result.body;
      this.checkError(error, field);
      return null;
    }
    return result.body;
  }

  checkError(result: APIErrorResultType, field: string) {
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
