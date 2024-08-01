function test(req,res){
    return res.status(201).send({
        message: "Hii!"
      });
}

module.exports = {
    test:test
};