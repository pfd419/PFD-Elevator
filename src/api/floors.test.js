import floorsApi from './floors.js';

describe('Floors api', () => {
  const mockCallback = jest.fn();
  const mockFloors = [
    { "id": "1", "name": "Lobby", "story": 1 },
    { "id": "2", "name": "Second", "story": 2 },
    { "id": "3", "name": "Third", "story": 3 },
  ];
  const mockFloorsReturn = [
    { "id": "3", "name": "Third", "story": 3 },
    { "id": "2", "name": "Second", "story": 2 },
    { "id": "1", "name": "Lobby", "story": 1 },
  ];
  let mockResponse;
  global.fetch = jest.fn();

  describe('getFloors', () => {
    it('gets floors json', async () => {
      mockResponse = { floors: mockFloors };
      jest.spyOn(global, 'fetch').mockImplementation(() => {
        return Promise.resolve({json: () => Promise.resolve(mockResponse)});
      });

      await floorsApi.getFloors(mockCallback);
      await expect(fetch).toHaveBeenCalledWith(
        '/data/floors.json',
        {
            headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        },
      );
      await expect(mockCallback).toHaveBeenCalledWith(mockFloorsReturn);
    });
  });
});
