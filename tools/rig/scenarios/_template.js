// Praxis rig -- suite _template: the smallest suite that works. One device, sign in, add a book, one check
// on the cloud. Copy this file to tools/rig/scenarios/<your-build>.js and run it with -Suite <your-build>.
// Everything core.js declares is in scope here: rig, check, stage, fail_user_reads, get, sorted, J, sleep.
// The page helpers a device carries (T.addBook, T.note, T.latches, ...) are in tools/rig/helpers.js.
// Rig code, not app code: the app's ES3 rule does not bind it.
'use strict';

rigSuite(async function () {
  const U = 'template-reader';
  await stage('T0', 'one device signs in and adds a book');
  const P = await (await rig.device('phone').open()).sign_in(U);
  const b = await P.ev("T.addBook('A book for the template')"); await P.wait();
  check('T0 the book reaches the cloud', rig.cloud.books(U), [b]);
});
