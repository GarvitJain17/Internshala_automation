const { timeout } = require("puppeteer");
const puppeteer = require("puppeteer");

async function start() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto("https://internshala.com");
  await page.click(".login-cta");
  await page.click("#modal_email");
  await page.type("#modal_email", "jaingarvit80@gmail.com");
  await page.click("#modal_password");
  await page.type("#modal_password", "WINZIP@1234winzip");
  await page.click("#modal_login_submit");
  // await page.waitForSelector(
  //   "#error_modal > div > div > div > div.image_container.error_image",
  //   { visible: true ,timeout:3000}
  // );
  // if (captcha) {
  //   await page.waitForSelector(
  //     "#error_modal > div > div > div > div.message_container > div.button_container > a",
  //     { visible: true }
  //   );
  //   await page.click(
  //     "#error_modal > div > div > div > div.message_container > div.button_container > a"
  //   );
  //   await page.waitForSelector("#modal_email", { visible: true });
  //   await page.click("#modal_login_submit");
  // }
  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 });
  // await page.screenshot({ path: "example.png" });
  await page.waitForSelector("#internships_new_superscript",{visibility:true});
  await page.click("#internships_new_superscript");
  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 });

  const applyButtons = await page.$$(
    ".btn.btn-primary.easy_apply.button_easy_apply_t"
  );
  console.log(applyButtons.length);
  for (let i = 1; i < applyButtons.length; i++) {
    await applyButtons[i].click();
    console.log(i);
    // Handle pop-up
    await page.waitForSelector("#continue_button", { visible: true });
    await page.click("#continue_button");
    console.log(i);
    let subskip = await page.$("#assessment_questions > h4:nth-child(8)");
    if (subskip) {
      page.click("#easy_apply_modal_close > i");
      await page.waitForSelector("#easy_apply_modal_close_confirm_exit", {
        visible: true,
      });
      await page.click("#easy_apply_modal_close_confirm_exit");
      continue;
    }
    await page.$("#cover_letter_holder > div.ql-editor.ql-blank > p");
    await page.click("#cover_letter_holder > div.ql-editor.ql-blank > p");
    await page.type(
      "#cover_letter_holder > div.ql-editor.ql-blank",
      "Over the past few years, I have acquired relevant skills and experience, which I shall bring to your organization. I have also worked tirelessly on my communication abilities and teamwork skills, which I will put to use in my future career, which would be in your organization if I am selected for the position."
    );

    await page.$("#radio1");
    await page.click("#radio1");

    let skipupload = await page.$(
      "#assessment_questions > div.custom-resume-container.form-group > div.file-frame-container > div.details > div.file-size"
    );
    if (!skipupload) {
      await page.waitForSelector(".custom-resume-label input[type='file']", {
        visible: true,
      });
      await page.click(".custom-resume-label");
      await page.uploadFile(
        ".custom-resume-label input[type='file']",
        "C:\\Users\\jaing\\Downloads\\GarvitJain_Resume.pdf"
      );
    }

    await page.waitForSelector("#submit", { visible: true });
    await page.click("#submit");
    
    await page.waitForSelector(".back-cta", { visible: true });
    // Handle the success pop-up
    await page.click(".back-cta");
    console.log(i);
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 });
  }
  await browser.close();
}

start();
