---
layout: post
title:  "Use wercker to automatically push to another remote repository"
date:   2017-10-20 21:16:01 +0800
categories: ci
---

***If your repository has more than one remote, this artical will make you be able to update all remotes with only one push***




## Wercker
Wercker is a Dutch software company with its namesake Docker-based continuous delivery platform that helps software developers build and deploy their applications and microservices. Using its command-line interface, developers can create Docker containers on their desktop, automate their build and deploy processes and then deploy them to various cloud platforms, ranging from Heroku to AWS and Rackspace. The company, with offices in Amsterdam, London and San Francisco, has open-sourced its command-line interface.

## How to use

#### 1. Sign up at Wercker is you do not have a Wercker account. (Recommend to sign up with Github account)

#### 2. Create a new application with your exist repository. (Some tips will show promoting you add wercker.yml to your repository)

#### 3. Modify wercker.yml
wercker.yml specify a series of bash commands by some formats:

* pre-defined:
	
	```
	# A step that executes `pip install` command.
   - pip-install
	```

* user-defined:
	
	```
	# A step to rum `ls` command
	- script:
        name: push to coding
        code: |
        	ls
	```

Adding some directives to step section does the job. In my case, push the code to the git.coding.net. 

```
  steps:
    # Push to coding.net
    - add-to-known_hosts:
        hostname: git.coding.net
        fingerprint: 98:ab:2b:30:60:00:82:86:bb:85:db:87:22:c4:4f:b1

    - add-ssh-key:
            keyname: MYKEY

    - script:
        name: push to coding
        code: |
          git remote add coding git@git.coding.net:hanjianqiao/saber.git
          git push coding master
```

Code above push master branch to coding.

There are three values which are relavent to your personal infomation:

* hostname: your another remote address, for example: git.coding.net (I use git account to access remote)

* fingerprint: your remote's public key's fingerprint, in md5 format

	```
	$ ssh-keyscan git.coding.net 1>key.pub
	$ ssh-keygen -lf key.pub -E md5
	```
	will get something like:
	
	```
	2048 MD5:98:ab:2b:30:60:00:82:86:bb:85:db:87:22:c4:4f:b1 git.coding.net (RSA)
	```

* keyname: for security reason, store your private key with protection

	Goto: `https://app.wercker.com`-->`Your project`-->`Environment`-->`Generate SSH Keys` to add new key such as `MYKEY` and you get `MYKEY_PUBLIC` `MYKEY_PRIVATE`, give `MYKEY` to keyname.

	You need to add generated public key to your target remote's access keys.

Last step is to set the target you want to push and push to it:

```
	# user defined bash command is a good choice
	- script:
		# name the code
	   	name: push to coding
	   	# write your bash command here
		code: |
			# here we do note have your anoter remote's information, you need to add it
			git remote add coding git@git.coding.net:hanjianqiao/saber.git
			# push it
			git push coding master
```

Here we are, push to github will trigger auto push to coding.net.


For more documentaton checkout [wercker devcenter][devcenter], [wercker use ssh key][wercker ssh key]


[devcenter]: http://devcenter.wercker.com/docs/home
[wercker ssh key]: http://devcenter.wercker.com/docs/ssh-keys
