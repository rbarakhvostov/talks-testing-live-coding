const mockStatesData = {
  'TST0' : 'Test0',
  'TST1' : 'Test1',
  'TST2' : 'Test2',
  'TST3' : 'Test3'
};

const mockZipLookupData = { state: 'TST' };
const mockZipLookupError = 'ERROR';

const mockGetStatesFn = jest.fn().mockImplementation(() => mockStatesData);

const mockZipLookupFn = jest.fn()
                          .mockImplementationOnce(() => Promise.resolve(mockZipLookupData))
                          .mockImplementationOnce(() => Promise.reject(mockZipLookupError));

jest.mock('./data', () => ({
  getStates: mockGetStatesFn,
  zipLookup: mockZipLookupFn,
}));

const states = require('./index');

let statesAbbrList;

beforeEach(() => {
  statesAbbrList = states.getStatesAbbrList();
});

describe('getStatesAbbrList', () => {
  it('should return list of abbreviations', () => {
    expect(statesAbbrList).toMatchSnapshot();
  });
});

describe('getStatesTypeAhead', () => {
  it('should return empty array when no input', () => {
    const result = states.getStatesTypeAhead();
    expect(result).toMatchSnapshot();
  });
  it('should return array of states that starts with symbols', () => {
    const typeAheadInput = 'Test0';
    const result = states.getStatesTypeAhead(typeAheadInput);
    expect(result).toMatchSnapshot();
  });
  it('should return array of states that starts with symbols limitted to 3 matches', () => {
    const typeAheadInput = 'Test';
    const result = states.getStatesTypeAhead(typeAheadInput);
    expect(result).toMatchSnapshot();
  });
});

describe('zipLookup', () => {
  it('should resolve correct zip', () => {
    expect.assertions(1);
    return expect(states.zipLookup('94085')).resolves.toMatchSnapshot();
  });

  it('should reject with error', () => {
    expect.assertions(1);
    return expect(states.zipLookup('94085')).rejects.toEqual('ERROR');
  });

  it('should reject on invalid zip', () => {
    expect.assertions(1);
    return expect(states.zipLookup('')).rejects.toMatchSnapshot();
  });
});
