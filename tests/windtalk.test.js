let isSetup = false;
const frameLinks = [];

function ensureSetup() {
  if (!isSetup) {
    for (let i = 0; i < 3; i++) {
      frameLinks.push(windtalk.link(document.getElementById(`if${i + 1}`).contentWindow));
    }
    isSetup = true;
  }
}

ensureSetup();

describe('sum', function () {
  it('Frame1 - sum of arguments', async function () {
    const remote = frameLinks[0];
    const result = await remote(2, 3);
    chai.expect(result).to.equal(5);
  });
});

describe('product', function () {
  it('Frame2 - product of arguments', async function () {
    const remote = frameLinks[1];
    const result = await remote.multiply(2, 3);
    chai.expect(result).to.equal(6);
  });
  it('Frame3 - product of arguments', async function () {
    const remote = frameLinks[2];
    const result = await remote.multiply(4, 7);
    chai.expect(result).to.equal(28);
  });
});

describe('duplex', function () {
  it('Frame2 - product of arguments', async function () {
    const remote = frameLinks[1];
    const result = await remote.multiply(2, 3);
    chai.expect(result).to.equal(6);
  });
  it('Frame3 - product of arguments', async function () {
    const remote = frameLinks[2];
    const result = await remote.multiply(4, 7);
    chai.expect(result).to.equal(28);
  });
});