---
layout: post
title:  "Leetcode: 1. Two Sum"
date:   2017-09-20 13:37:15 +0800
categories: leetcode algorithm
---
# Problem
Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.
```
Example:
Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```

# Solution

### solution 1: The brute force
The brute force approach is simple. Loop through each element x and find if there is another value that equals to target-x.
{% highlight c++ %}
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        vector<int> ret;
        //loop through each element x but not last one
        for(int i = 0; i < nums.size()-1; i++){
        	// find other value
        	// a+b and b+a are same combination, so j starts from i+1
      	 	for(int j = i+1; j < nums.size(); j++){
                if(nums[j] == target-nums[i]){
                    ret.push_back(i);
                    ret.push_back(j);
                    return ret;
                }
            }
        }
        return ret;
    }
};
{% endhighlight %}

### solution 2: Improved brute force
The idea is simple too: sort the vector than perform binary search to find target-x
{% highlight c++ %}
class Solution {
public:
    struct node{
        int value;
        int index;
        bool operator<(const node & other) const
        {
            return value < other.value ;
        }
    };
    vector<int> twoSum(vector<int>& nums, int target) {
        vector<int> ret;
        vector<node> nodes;
        vector<int>::iterator it;
        int i;
        for(i = 0, it = nums.begin(); it != nums.end(); it++, i++){
            node n = {.value = *it, .index = i};
            nodes.push_back(n);
        }
        sort(nodes.begin(), nodes.end());
        //loop through each element x but not last one
        for(int i = 0; i < nodes.size()-1; i++){
        	// find other value
        	// a+b and b+a are same combination, so j starts from i+1
            node key = {target-nodes[i].value};
            // binary search if target-x exist
        	if (binary_search (nodes.begin()+i+1, nodes.end(), key)){
                // binary search not return index, we do it ourselves
	      	 	for(int j = i+1; j < nodes.size(); j++){
	                if(nodes[j].value == target-nodes[i].value){
	                    ret.push_back(nodes[i].index);
	                    ret.push_back(nodes[j].index);
	                    return ret;
	                }
	            }
            }
        }
        return ret;
    }
};
{% endhighlight %}

### solution 3: Hash table
Using hash table to find x and anther target-x
{% highlight c++ %}
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> hash;
        vector<int> ret;
        // loop through each x
        for(vector<int>::iterator it = nums.begin(); it != nums.end(); it++){
            int y = target - *it;
            // try to find target-x
            if(hash.find(y) != hash.end()){
                ret.push_back(hash[y]);
                ret.push_back(it - nums.begin());
                return ret;
            }
            // not found, put x to hash
            hash[*it] = it - nums.begin();
        }
    }
};
{% endhighlight %}

Check out the [Two sum].

[Two sum]: https://leetcode.com/problems/two-sum/description/
