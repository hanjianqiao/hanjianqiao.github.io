---
layout: post
title:  "Leetcode: 2. Add Two Numbers"
date:   2017-09-20 13:37:15 +0800
categories: leetcode algorithm
---
# Problem
You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.
```
Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
Output: 7 -> 0 -> 8
```

# Solution

The approach is simple. Loop through each pair from two linked list, add and check if carray
{% highlight c++ %}
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode head(0), *tail, *p;
        int carray = 0;
        tail = &head;
        // loop through each list element
        while(l1 || l2){
            p = new ListNode(0);
            // a+b+carray
            if(l1){
                p->val += l1->val;
                l1 = l1->next;
            }
            if(l2){
                p->val += l2->val;
                l2 = l2->next;
            }
            p->val += carray;
            carray = 0;
            // if sum > 9 than carray
            if(p->val > 9){
                carray = p->val / 10;
                p->val %= 10;
            }
            tail->next = p;
            tail = tail->next;
        }
        // check if new sum long than l1 and l2
        if(carray){
            p = new ListNode(carray);
            tail->next = p;
            tail = tail->next;
        }
        // return
        return head.next;
    }
};{% endhighlight %}


Check out the [Add Two Numbers].

[Add Two Numbers]: https://leetcode.com/problems/add-two-numbers/description/
