const inquirer = require('inquirer');
const fs = require('fs');
const badges = {
    'GNU GPL v3.0' :  "[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)",

    'MIT' : "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)",

    'BSD 2-Clause' : "[![License](https://img.shields.io/badge/License-BSD_2--Clause-orange.svg)](https://opensource.org/licenses/BSD-2-Clause)",

    'BSD 3-Clause' : "[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)",

    'Boost Software license' : "[![License](https://img.shields.io/badge/License-Boost_1.0-lightblue.svg)](https://www.boost.org/LICENSE_1_0.txt)",

    'Creative Commons Zero 1.0' : "[![License: CC0-1.0](https://img.shields.io/badge/License-CC0_1.0-lightgrey.svg)](http://creativecommons.org/publicdomain/zero/1.0/)",

    'Eclipse Public License' : "[![License](https://img.shields.io/badge/License-EPL_1.0-red.svg)](https://opensource.org/licenses/EPL-1.0)",

    'Mozilla Public License' : "[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)" ,

    'The Unilicense' : "[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)"

}

console.log("\x1b[1m\x1b[32m%s\x1b[0m", "\n -- Welcome to the README assembly line! Answer the questions below.\n");
inquirer 
    .prompt([
        {
            type: 'input',
            message: 'Enter the project title...',
            name: 'title'
        },{
            type: 'input',
            message: 'Enter a description of the project...',
            name: 'description'
        },{
            type: 'input',
            message: 'Enter usage information...',
            name: 'usage'
        },{
            type: 'input',
            message: 'Enter contribution guidelines...',
            name: 'contribution'
        },{
            type: 'input',
            message: 'Enter test instructions...',
            name: 'testInstructions'
        },{
            type: 'list',
            message: 'Which license would you like to use?',
            name: 'license',
            choices: ['GNU GPL v3.0', 'MIT', 'BSD 2-Clause', 'BSD 3-Clause', 'Boost Software license','Creative Commons Zero 1.0','Eclipse Public License','Mozilla Public License','The Unilicense'],
        },{
            type: 'input',
            message: 'Enter your GitHub username...',
            name: 'username'
        },{
            type: 'input',
            message: 'Enter your E-mail address...',
            name: 'email'
        }
      



    ])
    .then((response) => {

        //parses the license to read as a proper sentence
        let license = response.license;
        if (license.split(' ')[0] != "The") {
            license = `The ${license}`;
        } 
        if (!(license.includes("license") || license.includes("License"))) {
            license = `${license} license`;
        }
        


        var markdown = //readme outline below
`# ${response.title}

${badges[response.license]}

## Description
${response.description}

## Contents
- [Description](#description)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Questions](#questions)
- [Tests](#tests)

## Usage

${response.usage}
## Questions

- [${response.username} on GitHub](https://github.com/${response.username})
- [${response.email}](mailto:${response.email})
## License

This project is licensed under ${license}
## Contributing

${response.contribution}
## Tests

${response.testInstructions}`


return markdown;

//--------------------------------------------------
        })
        .then((markdown) => readDirectory(markdown));

    function renameOldFiles(files, markdown) {
        let i = files.length;

        renameLastFile();
        function renameLastFile() {
           
            let x = `./output/README-${i}.md`;
            if (x == "./output/README-0.md") x = `./output/README.md`;
            let y = `./output/README-${i+1}.md`;

            fs.rename(x,y, function(err) {
                if (err) {
                    // console.log(err);
                    i--;
                    renameLastFile();
                }
                else {
                    console.log(`renamed ${x} to ${y}`);
                    if (i == 0) {
                        writeFile(markdown);
                    }
                    else {
                        i--;
                        renameLastFile();
                    }
                }
            }); 
        }
    }

    function readDirectory(markdown) {
        fs.readdir("./output/", function(err, files) { 
            if (err) {
                console.log("\x1b[1m\x1b[32m%s\x1b[0m", "\n -- creating 'output/' directory");
                fs.mkdir("./output", null, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        writeFile(markdown);
                    }
                    
                });
                
            } else if (files.includes("README.md")) {
                console.log("\x1b[1m\x1b[32m%s\x1b[0m", "\n -- README.md already exists. It will be renamed to README-1.md to make room for the new file.\n");
                renameOldFiles(files, markdown);
            } else {
                writeFile(markdown);
            }
        });
        
    }

    function writeFile(markdown) {
        fs.writeFile("./output/README.md", markdown, (err) => err ? console.log(err) : console.log("\x1b[1m\x1b[32m%s\x1b[0m", "\n -- Successfully generated README.md in the 'output/' directory."));
    }