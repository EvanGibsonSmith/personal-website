---
title: Kolmogorov Arnold Networks for Preventing Mode Collapse Generative Adversarial Networks
layout: blogLayout.njk
tags: blog
image: "/images/thumbnails/mnist_kan_t_SNE.png"
image-fit: "cover"
aspect: 1/1
date: 2025-09-24
---

Given an open ended project for Generative AI, and inspired by recent work on Kolmogorov Arnold Networks ([KANs](https://arxiv.org/abs/2404.19756)), this project explored replacing standard MLP layers in GAN architectures with KAN and GR-KAN layers to see if they could reduce mode collapse. The intuitive explanation to motivate this was that since Kolmogorov Arnold Networks operate on smooth B-Splines, that the critic and artist were less likely to collapse. We implemented these variants on MNIST and CIFAR-10 datasets, evaluated using Fréchet Inception Distance (FID) and t-SNE visualizations, and tested WGAN-GP training for stability. We wrote a short research paper on our methodologies and our results to evaluate the hypothesis that mode collapse could be prevented with Kolmogorov Arnold Networks. 

**Links:**

[**GitHub Repository**](https://github.com/EvanGibsonSmith/KAN-Mode-Collapse)

[**Google Drive (Models)**](https://drive.google.com/drive/folders/1BD8Mbtv9kS1nqVbga_bapDmWGwRdrZ3Q?usp=sharing
)


**Key findings:**

* MLP layers remained the most stable and reliable for GAN training.

* KAN and GR-KAN layers were prone to mode collapse, particularly on more complex datasets like CIFAR-10.

* WGAN-GP did not fully mitigate instability for KAN-based layers.

* While KANs showed theoretical promise, in practice they did not significantly improve GAN performance (and sometimes made worse) without further fine-tuning. 


<iframe src="/images/KANGAN.pdf"></iframe>
<div style="display: flex; justify-content: center; margin-top: 10px;">
    <a class="download-link" href="/images/KANGAN.pdf" download>
    📄 Download Paper
    </a>
</div>