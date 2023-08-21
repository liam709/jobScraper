//LinkedIn Web Crawler for job listings

import * as cheerio from 'cheerio';
import axios from 'axios';

let searchString  = "Software Developer";
let searchLoc = 'St%2BJohn%E2%80%99s%2C%2BNewfoundland%2Band%2BLabrador%2C%2BCanada'
let geoID = '104233796'
let jobId = '3689800686'
//Search via job title/location;
let linkedInUrl = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${searchString}%2B&location=${searchLoc}&geoId=${geoID}&trk=public_jobs_jobs-search-bar_search-submit&start=0`
//Search by job ID.


axios(linkedInUrl)
    .then(response => {
        let html = response.data;
        let $ = cheerio.load(html);
        let jobs = $('li');
        //Get properties of each job posting.
        jobs.each((index, element) => {
            let company = $(element).find('h4.base-search-card__subtitle').text().trim();
            let jobTitle = $(element).find('h3.base-search-card__title').text().trim();
            let location = $(element).find('span.job-search-card__location').text().trim();
            let link = $(element).find('a.base-card__full-link').attr('href')?.trim();
            let img = $(element).find('img.artdeco-entity-image--square-4').attr('data-delayed-url')
            let date =  $(element).find("time.job-search-card__listdate").text().trim();
            let id =  $(element).find('div.base-card').attr("data-entity-urn")?.split("urn:li:jobPosting:")[1];

            //Push each object into array.
            let linkedInJobs = [];
            linkedInJobs.push({
                "Company": company,
                "Job_Title": jobTitle,
                "Location": location,
                "Link": link,
                "Image URL": img,
                "Date": date,
                "Job_ID": id,
            })

            let linkedInUrl2 = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${id}`

            //Go to url based on job id, and add wanted props to job object.
            axios(linkedInUrl2).then(response => {
                //Loop over current 
                for (let i = 0; i < linkedInJobs.length; i++) {                     
                    let response2 = response.data;
                    let $2 = cheerio.load(response2)
                    let level = $2("li.description__job-criteria-item:nth-child(1) span").text().trim()
                    let type = $2("li.description__job-criteria-item:nth-child(2) span").text().trim()
                    let job_function = $2("li.description__job-criteria-item:nth-child(3) span").text().trim();
                    let industry = $2("li.description__job-criteria-item:nth-child(4) span").text().trim();
                    let description = $2("div.show-more-less-html__markup").text().trim();
                    linkedInJobs[i].level = level;
                    linkedInJobs[i].type = type;  
                    linkedInJobs[i].job_function = job_function;
                    linkedInJobs[i].industry = industry;
                    linkedInJobs[i].description = description;
                }
                console.log(linkedInJobs);
            })
        })
    })

        
  
