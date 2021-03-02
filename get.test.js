const fetch = require('requests')
async function fetchData(url) {

    let response = await fetch(url);
    return response  
}

test('the data is peanut butter', () => {
    return fetchData("https://imgur-backend.herokuapp.com/products/6032b5bd902f281db8786713").then(data => {
      expect(data.readable).toBe(true);
    });
  });

