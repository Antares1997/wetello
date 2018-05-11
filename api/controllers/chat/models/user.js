function User(client) {
  console.log('client', client);
  this.username = '';
  this.token = '';
  return (function(client) {
    if (typeof client === 'object') {
      if (client.username) {
        this.username = client.username;
      }
      if (client.token) {
        this.token = client.token;
        this.id = client.id;
      }
    } else if (typeof client === 'string') {
      this.username = client;
    }
    return this;
  })(client);
}

module.exports = User;