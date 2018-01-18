---
layout: post
title:  "Auto start job on pi 3"
date:   2018-01-18 13:17:01 +0800
categories: Device
---

Auto start job on pi 3



1. Edit file
```
sudo vim /lib/systemd/system/autojob.service
```

```
[Unit]
Description=Your job description
After=network.target auditd.service

[Service]
ExecStart=/usr/bin/python /home/pi/PATH_TO_PYTHON_FILE
ExecReload=/bin/kill -HUP $MAINPID
KillMode=process
Restart=on-failure
RestartPreventExitStatus=255
Type=notify

[Install]
WantedBy=multi-user.target
```

2. Enable autojob

```
sudo systemctl enable autojob
```
