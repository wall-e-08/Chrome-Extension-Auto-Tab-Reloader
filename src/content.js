setTimeout(() => {
  const jobs = []

  const _elems = document
    .querySelectorAll('[data-test-component="StencilReactCard"].jobCardItem');

  if (!_elems || _elems.length < 1) {
    return
  }

  for (let elem of _elems) {
    const childElements = elem.querySelectorAll('.jobDetailText');
    // console.log(childElements)
    const jobData = {}
    childElements.forEach((child, idx) => {
      if (idx === 0) {
        jobData['Title'] = child.innerText
      } else {
        let _list = child.innerText.split(": ")
        jobData[_list[0]] = _list[1]
      }
    });

    jobData['Location'] = elem
      .querySelector('[data-test-component="StencilReactCard"].jobCardItem [data-test-component="StencilText"]:not(.jobDetailText):last-child')
      .innerText
    jobs.push(jobData)
  }

  chrome.runtime.sendMessage({
    action: "updated_amazon_jobs",
    payload: { amazon_jobs: jobs }
  });

}, 1500);