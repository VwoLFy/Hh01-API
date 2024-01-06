import { CreateVideoInputModel, UpdateVideoInputModel, VideoType } from '../../src/repositories/repository';
import helpersForTests from '../utils/HelpersForTests';
import { HTTP_Status } from '../../src/enums';

describe('First test', () => {
  beforeAll(async () => {
    await helpersForTests.deleteAllData();
  });

  let video: VideoType;

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

    result ? (video = result) : video;

    const videos = await helpersForTests.getVideos();
    expect(videos).toEqual([video]);
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
    await helpersForTests.createVideo(createVideoInputBody, HTTP_Status.BAD_REQUEST_400, ['author', 'title']);
  });
  it('Should get video by id', async () => {
    const foundVideo = await helpersForTests.getVideosById(video.id);
    expect(foundVideo).toEqual(video);
  });
  it('Should return 404 if video is not exist', async () => {
    await helpersForTests.getVideosById(-video.id, HTTP_Status.NOT_FOUND_404);
    // @ts-ignore
    await helpersForTests.getVideosById('-video.id', HTTP_Status.NOT_FOUND_404);
  });
  it('Should update video', async () => {
    const updateVideoInputModel: UpdateVideoInputModel = {
      title: video.title + '_upd',
      author: video.author + '_upd',
      availableResolutions: ['P1440'],
      minAgeRestriction: 17,
      publicationDate: new Date().toISOString(),
      canBeDownloaded: false,
    };
    await helpersForTests.updateVideo(video.id, updateVideoInputModel);

    const result = await helpersForTests.getVideosById(video.id);
    expect(result).toEqual({
      id: video.id,
      title: updateVideoInputModel.title,
      author: updateVideoInputModel.author,
      canBeDownloaded: updateVideoInputModel.canBeDownloaded,
      minAgeRestriction: updateVideoInputModel.minAgeRestriction,
      createdAt: video.createdAt,
      publicationDate: updateVideoInputModel.publicationDate,
      availableResolutions: updateVideoInputModel.availableResolutions,
    });
  });
  it('Shouldn`t update video using bad data', async () => {
    const validUpdateVideoInputModel: UpdateVideoInputModel = {
      title: video.title + '_upd',
      author: video.author + '_upd',
      availableResolutions: ['P1440'],
      minAgeRestriction: 17,
      publicationDate: new Date().toISOString(),
      canBeDownloaded: false,
    };
    let updateVideoInputModel: UpdateVideoInputModel = { ...validUpdateVideoInputModel, title: ' ' };
    await helpersForTests.updateVideo(video.id, updateVideoInputModel, HTTP_Status.BAD_REQUEST_400, 'title');

    updateVideoInputModel.title = 'a'.repeat(41);
    await helpersForTests.updateVideo(video.id, updateVideoInputModel, HTTP_Status.BAD_REQUEST_400, 'title');

    // @ts-ignore
    delete updateVideoInputModel.title;
    await helpersForTests.updateVideo(video.id, updateVideoInputModel, HTTP_Status.BAD_REQUEST_400, 'title');

    updateVideoInputModel = { ...validUpdateVideoInputModel };

    // @ts-ignore
    updateVideoInputModel.availableResolutions = 'P144';
    await helpersForTests.updateVideo(
      video.id,
      updateVideoInputModel,
      HTTP_Status.BAD_REQUEST_400,
      'availableResolutions',
    );

    updateVideoInputModel.availableResolutions = ['P140'];
    await helpersForTests.updateVideo(
      video.id,
      updateVideoInputModel,
      HTTP_Status.BAD_REQUEST_400,
      'availableResolutions',
    );

    updateVideoInputModel.availableResolutions = ['P140', 'P144'];
    await helpersForTests.updateVideo(
      video.id,
      updateVideoInputModel,
      HTTP_Status.BAD_REQUEST_400,
      'availableResolutions',
    );

    // @ts-ignore
    delete updateVideoInputModel.availableResolutions;
    await helpersForTests.updateVideo(
      video.id,
      updateVideoInputModel,
      HTTP_Status.BAD_REQUEST_400,
      'availableResolutions',
    );

    updateVideoInputModel = { ...validUpdateVideoInputModel };

    updateVideoInputModel.author = 'T'.repeat(21);
    await helpersForTests.updateVideo(video.id, updateVideoInputModel, HTTP_Status.BAD_REQUEST_400, 'author');

    updateVideoInputModel.author = '  ';
    await helpersForTests.updateVideo(video.id, updateVideoInputModel, HTTP_Status.BAD_REQUEST_400, 'author');

    updateVideoInputModel.title = '';
    updateVideoInputModel.author = '  ';
    await helpersForTests.updateVideo(video.id, updateVideoInputModel, HTTP_Status.BAD_REQUEST_400, [
      'title',
      'author',
    ]);
  });
  it('Should delete video by id', async () => {
    await helpersForTests.deleteVideo(video.id, HTTP_Status.NO_CONTENT_204);
    await helpersForTests.getVideosById(video.id, HTTP_Status.NOT_FOUND_404);
    const result = await helpersForTests.getVideos();
    expect(result.length).toBe(1);
  });
  it('Shouldn`t delete if video is not found', async () => {
    await helpersForTests.deleteVideo(video.id, HTTP_Status.NOT_FOUND_404);
    // @ts-ignore
    await helpersForTests.deleteVideo('video.id', HTTP_Status.NOT_FOUND_404);
  });
});
