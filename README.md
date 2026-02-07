![Masquerades][titleImg]

# Table of Contents
- [Table of Contents](#table-of-contents)
- [Synopsis](#synopsis)
- [Tech Stack](#tech-stack)
- [Storage Limitations](#storage-limitations)
  - [Maximum Length Reference](#maximum-length-reference)
- [Issues](#issues)
- [Contribution](#contribution)
- [To Do List](#to-do-list)

# Synopsis

**Masquerades** is a web-based survey platform. **Create surveys, let participants give their feedback, and visually analyze the results using our easy-to-use Statistics Dashboard.** Give your 
customers peace of mind by ensuring their online privacy is preserved. Masquerades prides itself on never sharing nor collecting user data. We've taken the steps necessary to ensure user data is never 
revealed, even to other users of the platform. Now more than ever, people are concerned with how their private information is being collected and exchanged without their knowledge on the internet. 
Masquerades takes this consideration off your shoulders; make it easy for your users and yourself by focusing on data-driven insights rather than worrying about the technical privacy concerns of a third-party 
service. **Masquerades keeps users anonymous, never collects private user data, and the best part? You can start for completely free!** Note that Masquerades is currently headed and developed by one 
person (subject to change). For a large-scale organization, we do recommend that another survey provider capable of enterprise-level data insights be employed. However, Masquerades is a great place to get 
started and it costs you nothing, so why not get started? Enjoy our easy-to-use, privacy-first service that works for you and your customers. Masquerades is available to access [here][appLink].

# Tech Stack

Masquerades was built on the following **technologies:**

- [![React][reactImg]][reactLink]
- [![Django][djangoImg]][djangoLink]
- [![MongoDB][mongoImg]][mongoLink]
- [![TypeScript][typescriptImg]][typescriptLink]
- [![ApexCharts][apexchartsImg]][apexchartsLink]
- [![Cloudinary][cloudinaryImg]][cloudinaryLink]
- [![Netlify][netlifyImg]][netlifyLink]
- [![Docker][dockerImg]][dockerLink]
- [![Oracle][oracleImg]][oracleLink]
- [![NGINX][nginxImg]][nginxLink]
- [![Let's Encrypt][letsencryptImg]][letsencryptLink]

This project features an isolated back- and front-end. **Django REST Framework** makes up the majority of the server; the UI is a **React** app written in **TypeScript.** The UI is a static 
website deployed to the **Netlify** CDN; it consumes the API which is hosted on an **Oracle Cloud Infrastructure** compute instance. The instance runs a **Docker** container sitting behind an 
**NGINX** proxy that uses **Let's Encrypt** to maintain SSL encryption on HTTP requests.

# Storage Limitations

Masquerades is a side project that currently has a limited number of resources to operate on (subject to change). As a result of these limitations (money, time, developers, etc.), the service 
imposes a number of limits on data storage in its current state. One of the most noticeable effects of these limitations is the maximum length of text that can be stored. Below is a reference 
for the maximum lengths of different text items that users need to assign in Masquerades.

## Maximum Length Reference

| Name                        | Maximum Length      | Description |
| --------------------------- | ------------- | ----------- |
| Question Count        | **10**           | Maximum number of questions per survey |
| Answer Count             | **4**             | Maximum number of answers per question in a survey |
| Survey Name               | **50**             | Maximum character length of a survey's name |
| Question      | **200**             | Maximum character length for each of a survey's questions |
| Answer                        | **150**            | Maximum character length for each of a survey's questions' answers |

# Issues

Create an [issue][issueLink] if you need to contact us about an existing problem or bug in Masquerades. It may take some time for us to respond to and resolve complex issues.

# Contribution

Fork this repository and open a [pull request][contributionLink] to suggest any feature additions. Your request will be reviewed and responded to accordingly.

# To Do List

- [ ] Pagination
- [ ] Link-based Invites

[titleImg]: /readmeAssets/titleImage.png

[typescriptImg]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[reactImg]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=1c2c4c
[mongoImg]: https://img.shields.io/badge/-MongoDB-13aa52?style=for-the-badge&logo=mongodb&logoColor=white
[djangoImg]: https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green
[cloudinaryImg]: https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white
[apexchartsImg]: https://img.shields.io/badge/ApexCharts-2e96e6?style=for-the-badge&logo=apexcharts
[netlifyImg]: https://img.shields.io/badge/-netlify-blue?style=for-the-badge&logo=netlify&logoColor=green
[dockerImg]: https://img.shields.io/badge/docker-257bd6?style=for-the-badge&logo=docker&logoColor=white
[oracleImg]: https://img.shields.io/badge/Oracle-F80000?style=for-the-badge&logo=oracle&logoColor=white
[nginxImg]: https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white
[letsencryptImg]: https://img.shields.io/badge/letsencrypt-003A70?style=for-the-badge&logo=letsencrypt&logoColor=white

[appLink]: https://masquerades.netlify.app/
[typescriptLink]: https://www.typescriptlang.org/
[reactLink]: https://react.dev/
[mongoLink]: https://www.mongodb.com/
[djangoLink]: https://www.djangoproject.com/
[cloudinaryLink]: https://cloudinary.com/
[apexchartsLink]: https://apexcharts.com/
[netlifyLink]: https://www.netlify.com/
[dockerLink]: https://www.docker.com/
[oracleLink]: https://www.oracle.com/cloud/
[nginxLink]: https://nginx.org/
[letsencryptLink]: https://letsencrypt.org/
[issueLink]: https://github.com/ranjotdharni/masquerade/issues
[contributionLink]: https://github.com/ranjotdharni/masquerade/pulls
