// app.ts

// Remove the first two elements (path to node and path to script)
const args = process.argv;
import fs from "fs";

const alphanumeric =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

async function sendConcurrentRequests(tasks: string[]) {
  // console.log("trying", tasks);
  try {
    const requests = tasks.map((url) => fetch(url));
    const responses = await Promise.all(requests);
    const data = await Promise.all(responses);
    data.forEach(
      (item) => item.status === 200 && console.log("Found result:", item.url)
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

const main = async () => {
  const tasks: string[] = [];

  fs.readFile("./codes.txt", "utf8", async (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    const lines = data.split("\n");

    for (const line of lines.slice(start, finish)) {
      // Log the file content
      // console.log(`File content: ${line}`);
      const url = `https://cake-gm.com/${line}`;
      tasks.push(url);
      if (tasks.length === 70) {
        await sendConcurrentRequests(tasks);
        tasks.length = 0;
      }
    }
  });
};

main();
