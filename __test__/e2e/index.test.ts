import { CreateVideoInputModel } from '../../src/repositories/repository';
import helpersForTests from '../utils/HelpersForTests';
import { HTTP_Status } from '../../src/enums';

describe('First test', () => {
  beforeAll(async () => {
    await helpersForTests.deleteAllData();
  });

  it('Should get empty array of videos', async () => {
    const videos = await helpersForTests.getVideos();
    expect(videos).toEqual([]);
  });
  it('Should create new video', async () => {
    const createVideoInputBody: CreateVideoInputModel = {
      title: 'T2',
      author: 'Scott',
      availableResolutions: ['P144'],
    };

    const result = await helpersForTests.createVideo(createVideoInputBody);
    expect(result).toEqual({
      id: expect.any(Number),
      title: createVideoInputBody.title,
      author: createVideoInputBody.author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
      availableResolutions: createVideoInputBody.availableResolutions,
    });

    const videos = await helpersForTests.getVideos();
    expect(videos).toEqual([result]);
  });
  it('Should create second video', async () => {
    const createVideoInputBody: CreateVideoInputModel = {
      title: 'T2-2',
      author: 'Scott St',
      availableResolutions: ['P144', 'P1440'],
    };

    const result = await helpersForTests.createVideo(createVideoInputBody);
    const videos = await helpersForTests.getVideos();
    expect(videos.length).toBe(2);
    expect(videos[1]).toEqual(result);
  });
  it('Shouldn`t create new video with incorrect data', async () => {
    let validVideoInputBody: CreateVideoInputModel = {
      title: 'T2-2',
      author: 'Scott St',
      availableResolutions: ['P144', 'P1440'],
    };
    let createVideoInputBody = { ...validVideoInputBody };

    // @ts-ignore
    createVideoInputBody.availableResolutions = 'P144';
    await helpersForTests.createVideo(createVideoInputBody, HTTP_Status.BAD_REQUEST_400, 'availableResolutions');

    createVideoInputBody.availableResolutions = ['P140'];
    await helpersForTests.createVideo(createVideoInputBody, HTTP_Status.BAD_REQUEST_400, 'availableResolutions');

    createVideoInputBody.availableResolutions = ['P140', 'P144'];
    await helpersForTests.createVideo(createVideoInputBody, HTTP_Status.BAD_REQUEST_400, 'availableResolutions');

    // @ts-ignore
    delete createVideoInputBody.availableResolutions;
    await helpersForTests.createVideo(createVideoInputBody, HTTP_Status.BAD_REQUEST_400, 'availableResolutions');

    createVideoInputBody = { ...validVideoInputBody };
    createVideoInputBody.title = 'T'.repeat(41);
    await helpersForTests.createVideo(createVideoInputBody, HTTP_Status.BAD_REQUEST_400, 'title');

    createVideoInputBody.title = '  ';
    await helpersForTests.createVideo(createVideoInputBody, HTTP_Status.BAD_REQUEST_400, 'title');

    // @ts-ignore
    delete createVideoInputBody.title;
    await helpersForTests.createVideo(createVideoInputBody, HTTP_Status.BAD_REQUEST_400, 'title');

    createVideoInputBody = { ...validVideoInputBody };
    createVideoInputBody.author = 'T'.repeat(21);
    await helpersForTests.createVideo(createVideoInputBody, HTTP_Status.BAD_REQUEST_400, 'author');

    createVideoInputBody.author = '  ';
    await helpersForTests.createVideo(createVideoInputBody, HTTP_Status.BAD_REQUEST_400, 'author');

    createVideoInputBody.title = '';
    createVideoInputBody.author = '  ';
    await helpersForTests.createVideo(createVideoInputBody, HTTP_Status.BAD_REQUEST_400);
  });
});
