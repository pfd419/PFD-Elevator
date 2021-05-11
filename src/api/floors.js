
export default {
    getFloors: async callback => {
        fetch(
            '/data/floors.json',
            {
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
        .then((response) => response.json())
        .then(async (myJson) => {
            const sortedJson = myJson.floors.sort((a,b) => parseInt(b.story, 10) - parseInt(a.story, 10));
            await callback(sortedJson);
          });
    }
}