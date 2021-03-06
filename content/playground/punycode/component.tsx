import { useEffect, useState } from 'react';
import { punycode } from './punycode.ts';

export function Form() {
  const [unicode, setUnicode] = useState('');
  const [ascii, setAscii] = useState('');
  const [settingAscii, setSettingAscii] = useState(false);
  const [settingUnicode, setSettingUnicode] = useState(false);

  useEffect(() => {
    if (settingUnicode) {
      setAscii(punycode.toASCII(unicode));
      setSettingUnicode(false);
    }
  }, [unicode]);

  useEffect(() => {
    if (settingAscii) {
      try {
        setUnicode(punycode.toUnicode(ascii));
      } catch (e) {}
      setSettingAscii(false);
    }
  }, [ascii]);

  return (
    <div className='mx-auto my-4'>
      <div className='form-control'>
        <label className='label'>
          <span className='label-text'>Unicode</span>
        </label>
        <input
          type='text'
          placeholder='中文域名 Unicode'
          value={unicode}
          onChange={(e) => {
            setSettingUnicode(true);
            setUnicode(e.target.value);
          }}
          className='input input-bordered text-secondary input-secondary'
        />
      </div>

      <div className='form-control'>
        <label className='label'>
          <span className='label-text'>ASCII</span>
        </label>
        <input
          type='text'
          placeholder='Punycode 转码域名 ASCII'
          value={ascii}
          onChange={(e) => {
            setSettingAscii(true);
            setAscii(e.target.value);
          }}
          className='input input-bordered text-secondary input-secondary'
        />
      </div>
    </div>
  );
}
