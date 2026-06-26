const dns = require("dns");

console.log(dns.getServers());

dns.resolveSrv(
  "_mongodb._tcp.cluster0.meg3dzn.mongodb.net",
  (err, records) => {
    console.log("ERR:");
    console.log(err);

    console.log("RECORDS:");
    console.log(records);
  }
);