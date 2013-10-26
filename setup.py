#!/usr/bin/env python
from distutils.core import setup

setup(
	name='gobbldygook',
    version='1.5',
    author='Hawken Rives and Xandra Best',
    author_email='rives@stolaf.edu',
    packages=['gobbldygook', 'distutils.command'],
    requires=['yaml']
)
